import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Color,
  AmbientLight,
  DirectionalLight,
  Vector3,
  Box3,
  Raycaster,
  Vector2,
  Mesh,
  TextureLoader, MeshStandardMaterial,
} from 'three';
import * as THREE from 'three';
import { GLTFLoader, DRACOLoader } from 'three-stdlib';
import {OrbitControls} from 'three-stdlib';
import {Card} from 'primeng/card';
import {Model_info} from './teeth_info';
import {CommonModule} from '@angular/common';
import {Slider} from 'primeng/slider';
import {FormsModule} from '@angular/forms';
import {Button} from 'primeng/button';
import {firstValueFrom, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {ToothQuality, ToothStats} from './BrushingStats';
import {BrushingControllerService, BrushingResponseDTO, BrushingTrainDTO} from '../../api';

@Component({
  selector: 'app-model3d',
  templateUrl: './model3d.html',
  standalone: true,
  imports: [
    CommonModule,
    Card,
    Slider,
    FormsModule,
    Button
  ],
  styleUrls: ['./model3d.css']
})
export class ModelComponent implements AfterViewInit {
  @ViewChild('container', { static: true }) container!: ElementRef;
  scene!: Scene;
  camera!: PerspectiveCamera;
  renderer!: WebGLRenderer;
  controls!: OrbitControls;
  selectedTooth: string | null = null;
  selectedToothInfo: any = null;
  raycaster = new Raycaster();
  mouse = new Vector2();
  cariesValue: number = 0;
  textures: any[] = [];
  model!: THREE.Object3D;
  brushingActive = false;
  lastMoveTime = 0;
  activeTooth: Mesh | null = null;
  private teethMeshes: Mesh[] = [];
  private toothStats = new Map<string, ToothStats>();
  private toothResult = new Map<string, ToothQuality>();
  private readonly GRID_SIZE = 20;
  public sessionDone = false;
  public resultsArray: Array<{ toothName: string; result: ToothQuality }> = [];
  private toothAdvice = new Map<string, string[]>();
  public shiftDown = false;
  public cursorX = 0;
  public cursorY = 0;

  constructor(private readonly brushingService: BrushingControllerService) {}

  ngOnDestroy(): void {
    try {
      if (this.renderer?.domElement) {
        this.renderer.domElement.removeEventListener('click', this.onMouseClick);
        this.renderer.domElement.removeEventListener('mousemove', this.onBrushMove);
      }
    } catch {
      // noop
    }
  }

  loadTextures() {
    const loader = new TextureLoader();
    this.textures = [
      loader.load('Ground054_1K-PNG_Color.png'),
      loader.load("img.png"),
      loader.load("img_1.png"),
      loader.load('SurfaceImperfections011_1K-PNG_Color.png'),
    ];
  }

  onCariesChange(value: number) {
    const index = Number(value);

    if (!this.model || this.textures.length === 0) return;

    this.model.traverse((obj: any) => {
      if (
        obj.isMesh &&
        (obj.name.toLowerCase().includes("6") || obj.name.toLowerCase().includes("7"))
      ) {
        if (index === 0) {
          obj.material.map = obj.userData.originalMaterial.map;
        } else {
          obj.material.map = this.textures[index - 1];
        }

        obj.material.needsUpdate = true;
      }
    });
  }

  ngAfterViewInit() {
    this.scene = new Scene();
    this.scene.background = new Color(0x333333);

    const { width, height } = this.getViewportSize();

    this.camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.set(-0.2, 0.25, 5);

    this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(width, height);
    this.container.nativeElement.appendChild(this.renderer.domElement);

    const ambientLight = new AmbientLight(0xffffff, 0.7);
    const directionalLight = new DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    this.scene.add(ambientLight, directionalLight);

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Shift') this.shiftDown = true;
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'Shift') this.shiftDown = false;
    });


    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    gltfLoader.setDRACOLoader(dracoLoader);

    gltfLoader.load('Untitled4.glb', (gltf) => {
      this.model = gltf.scene;
      this.model.traverse((obj: any) => {
        if (obj.isMesh) {
          obj.material = obj.material.clone();
          obj.userData.originalMaterial = obj.material.clone();
        }
      });
      const model = gltf.scene;


      const box = new Box3().setFromObject(model);
      const size = box.getSize(new Vector3());
      const center = box.getCenter(new Vector3());

      model.position.sub(center);
      model.position.x -= size.x * 0.08;

      this.scene.add(model);

      // ===== CAMERA + ZOOM AUTOMAT =====
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = this.camera.fov * (Math.PI / 180);
      let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
      cameraZ *= 2.2;

      this.camera.position.set(-maxDim * 0.1, size.y * 0.02, cameraZ);
      this.camera.near = cameraZ / 100;
      this.camera.far = cameraZ * 100;
      this.camera.updateProjectionMatrix();

      this.controls.target.set(-maxDim * 0.08, 0, 0);
      this.controls.update();

      this.loadTextures();
      this.collectTeethMeshes();
      this.animate();
    });
    this.renderer.domElement.addEventListener('click', this.onMouseClick);
    this.renderer.domElement.addEventListener(
      'mousemove',
      this.onBrushMove
    );
  }


  @HostListener('window:resize')
  onResize(): void {
    if (!this.camera || !this.renderer) {
      return;
    }

    const { width, height } = this.getViewportSize();
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  private getViewportSize() {
    const host = this.container?.nativeElement as HTMLElement;
    const width = Math.max(host?.clientWidth ?? 0, 640);
    const height = Math.max(host?.clientHeight ?? 0, 620);
    return { width, height };
  }


  private collectTeethMeshes() {
    this.teethMeshes = [];

    this.model.traverse((obj: any) => {
      if (!obj?.isMesh) return;
      if (
        obj.isMesh &&
        (obj.name.toLowerCase().includes("6") || obj.name.toLowerCase().includes("7"))
      ) {
        this.teethMeshes.push(obj as Mesh);
      }
    });

    if (this.teethMeshes.length === 0) {
      this.model.traverse((obj: any) => {
        if (obj?.isMesh) this.teethMeshes.push(obj as Mesh);
      });
    }
  }

  onMouseClick = (event: MouseEvent) => {
    if (this.brushingActive) return;

    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    if (intersects.length > 0) {
      const mesh = intersects[0].object as Mesh;

      if (!this.brushingActive) {
        this.selectedToothInfo = Model_info[mesh.name] || null;
        this.selectedTooth = mesh.name || "Dintele fără nume";
        return;
      }

      this.activeTooth = mesh;
      this.selectedTooth = mesh.name || "Dintele fără nume";
      this.selectedToothInfo = Model_info[mesh.name] || null;
    }
  }
  animate = () => {
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  async toggleBrushing() {
    this.brushingActive = !this.brushingActive;

    if (this.brushingActive) {
      // START
      this.lastMoveTime = 0;
      this.activeTooth = null;
      this.sessionDone = false;
      this.resultsArray = [];

      this.toothStats.clear();
      this.toothResult.clear();

      this.resetAllToothMaterials();

    } else {

      if (this.activeTooth) {
        this.activeTooth.scale.set(1, 1, 1);
      }
      this.activeTooth = null;


      await this.evaluateAllTeethAndColor();
      const rows = this.buildTrainingRowsMinimal();
      await firstValueFrom(this.brushingService.saveTrainRows(rows));
    }
  }

  private resetAllToothMaterials() {
    for (const tooth of this.teethMeshes) {
      if (tooth.userData?.["originalMaterial"]) {
        tooth.material = tooth.userData["originalMaterial"].clone();
      }
      tooth.scale.set(1, 1, 1);
    }
  }

  onBrushMove = (event: MouseEvent) => {
    if (!this.brushingActive) return;
    if (!this.shiftDown) return;
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.cursorX = event.clientX - rect.left;
    this.cursorY = event.clientY - rect.top;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const hits = this.raycaster.intersectObjects(this.teethMeshes, true);
    if (hits.length === 0) return;

    const hit = hits[0];
    const tooth = hit.object as Mesh;
    const toothName = tooth.name || 'unknown_tooth';

    // update UI active tooth
    if (this.activeTooth && this.activeTooth !== tooth) {
      this.activeTooth.scale.set(1, 1, 1);
    }
    this.activeTooth = tooth;
    this.selectedTooth = toothName;
    this.selectedToothInfo = Model_info[toothName] || null;

    // inițializează stats
    this.ensureToothStats(toothName);
    const stats = this.toothStats.get(toothName)!;

    // time delta
    const now = Date.now();

    if (stats.lastTime === null) {
      stats.lastTime = now;
      return;
    }

    const dt = (now - stats.lastTime) / 1000;
    stats.lastTime = now;
    if (dt <= 0) return;

    // speed normalizat
    const dx = event.movementX;
    const dy = event.movementY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const speedPxPerSec = dist / dt;
    const speed = speedPxPerSec / 900; // tunează 600-1600 după mouse

    stats.movements++;
    stats.speedSum += speed;

    // variance Welford
    const n = stats.movements;
    const delta = speed - stats.speedMean;
    stats.speedMean += delta / n;
    const delta2 = speed - stats.speedMean;
    stats.speedM2 += delta * delta2;
    stats.speedVariance = n > 1 ? stats.speedM2 / (n - 1) : 0;

    // circular ratio (direction change)
    if (dist > 0.5) {
      stats.totalTime += dt;
      const angle = Math.atan2(dy, dx);

      if (stats.lastAngle !== null) {
        let dA = angle - stats.lastAngle;
        if (dA > Math.PI) dA -= 2 * Math.PI;
        if (dA < -Math.PI) dA += 2 * Math.PI;

        stats.angleSamples++;

        // praguri mai permisive
        if (Math.abs(dA) > 0.05 && Math.abs(dA) < 1) {
          stats.circularHits++;
        }
      }

      stats.lastAngle = angle;
    }

    stats.circularRatio = stats.angleSamples >= 10
      ? (stats.circularHits / stats.angleSamples)
      : 0;


    const localPoint = tooth.worldToLocal(hit.point.clone());

    const min = stats.bboxMin;
    const max = stats.bboxMax;

    const sizeX = Math.max(1e-6, max.x - min.x);
    const sizeY = Math.max(1e-6, max.y - min.y);

// normalizează 0..1 în bbox
    const nx = (localPoint.x - min.x) / sizeX;
    const ny = (localPoint.y - min.y) / sizeY;

// clamp
    const u = Math.min(0.999999, Math.max(0, nx));
    const v = Math.min(0.999999, Math.max(0, ny));

    const i = Math.floor(u * this.GRID_SIZE);
    const j = Math.floor(v * this.GRID_SIZE);

    stats.coverageGrid.add(`${i}_${j}`);
    stats.coverage = stats.coverageGrid.size / (this.GRID_SIZE * this.GRID_SIZE);
  };

  private ensureToothStats(toothName: string) {
    if (this.toothStats.has(toothName)) return;

    const mesh = this.teethMeshes.find(m => m.name === toothName);
    if (mesh) {
      mesh.geometry.computeBoundingBox();
    }

    const bb = mesh?.geometry?.boundingBox;
    console.log(`Tooth ${toothName} bounding box:`, bb);
    const min = bb ? bb.min.clone() : new THREE.Vector3(-1, -1, -1);
    const max = bb ? bb.max.clone() : new THREE.Vector3(1, 1, 1);

    this.toothStats.set(toothName, {
      totalTime: 0,
      movements: 0,
      speedSum: 0,
      speedVariance: 0,
      circularRatio: 0,
      coverage: 0,

      speedMean: 0,
      speedM2: 0,

      lastAngle: null,
      circularHits: 0,
      angleSamples: 0,
      lastTime:null,
      bboxMin: min,
      bboxMax: max,
      brushingStart: null,
      lastContact: null,


      coverageGrid: new Set<string>(),
    });

    this.toothResult.set(toothName, 'unknown');
  }


  private async evaluateAllTeethAndColor(): Promise<void> {
    const recommendedTime = 5;

    const entries = Array.from(this.toothStats.entries());

    // dacă n-ai periat nimic, nu face nimic
    if (entries.length === 0) return;

    for (const [toothName, stats] of entries) {
      // prag minim: dacă ai atins dintele prea puțin -> poor
      if (stats.movements < 3 || stats.totalTime < 0.7) {
        this.toothResult.set(toothName, 'poor');
        this.colorToothByName(toothName, 'poor');
        continue;
      }

      const payload = {
        toothName,
        totalTime: stats.totalTime,
        avgSpeed: stats.speedSum / Math.max(1, stats.movements),
        speedVariance: stats.speedVariance,
        circularRatio: stats.circularRatio,
        coverage: stats.coverage,
        recommendedTime,
      };

      try {
        const res: BrushingResponseDTO = await firstValueFrom(this.brushingService.evaluate(payload));

        const result = (res?.result ?? 'unknown') as ToothQuality;
        const advice = res?.advice ?? [];

        this.toothResult.set(toothName, result);
        this.toothAdvice.set(toothName, advice);

        this.colorToothByName(toothName, result);
      } catch {
        this.toothResult.set(toothName, 'unknown');
        this.colorToothByName(toothName, 'unknown');
      }
    }
    this.resultsArray = Array.from(this.toothResult.entries()).map(([toothName, result]) => ({ toothName, result }));
    this.sessionDone = true;

  }
  get selectedToothResult(): ToothQuality | null {
    if (!this.selectedTooth) return null;
    return this.toothResult.get(this.selectedTooth) ?? null;
  }

  get selectedToothAdvice(): string[] {
    if (!this.selectedTooth) return [];
    return this.toothAdvice.get(this.selectedTooth) ?? [];
  }

  private colorToothByName(toothName: string, result: ToothQuality) {
    if (this.brushingActive) return;
    const tooth = this.teethMeshes.find((m) => m.name === toothName);
    if (!tooth) return;

    const mat = tooth.material as MeshStandardMaterial;

    if (result === 'poor') mat.color.set(0xff5555);
    else if (result === 'ok') mat.color.set(0xffdd55);
    else if (result === 'good') mat.color.set(0x55ff55);
    else mat.color.set(0x999999);
  }

  private buildTrainingRowsMinimal():BrushingTrainDTO[] {
    return Array.from(this.toothStats.values()).map(s => ({
      totalTime: s.totalTime,
      avgSpeed: s.speedSum / Math.max(1, s.movements),
      speedVariance: s.speedVariance,
      circularRatio: s.circularRatio,
      coverage: s.coverage,
    }));
  }

}
