FROM gradle:8.8-jdk17 AS build
WORKDIR /app

COPY . .
RUN gradle clean bootJar -x generateAngularClient --no-daemon
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
RUN mkdir -p /app/uploads

EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]