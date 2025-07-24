# Job Portal

Este proyecto es una **aplicación web de portal de empleo**. Está en desarrollo activo y permite tanto a **empresas** como a **candidatos** registrarse, iniciar sesión y gestionar sus funcionalidades de forma sencilla.

> ✅ Las **empresas** pueden registrarse desde la web, iniciar sesión, crear ofertas y ver los candidatos inscritos.  
> ✅ Los **candidatos** pueden registrarse, iniciar sesión, **ver su perfil**, completarlo y **postularse a ofertas**.  
> ✅ El **administrador** puede **añadir, editar y eliminar empresas** desde su panel privado.  

---

## Funcionalidades actuales

- ✅ Registro de empresas desde el frontend  
- ✅ Inicio de sesión de empresa  
- ✅ Panel de empresa con gestión de ofertas  
- ✅ Visualización de candidatos inscritos en cada oferta  
- ✅ Acceso al perfil de cada candidato desde la vista de empresa  
- ✅ Registro e inicio de sesión de candidatos desde la web  
- ✅ Visualización y edición del perfil de candidato  
- ✅ Inscripción de candidatos en ofertas  
- ✅ Panel de administrador para añadir, editar y eliminar empresas  
- 🔐 Autenticación segura con Spring Security  

---

## Usuarios de prueba

Puedes usar los siguientes usuarios para probar la plataforma:

### Candidato
- **Usuario:** federico  
- **Contraseña:** 1234

### Empresa
- **Usuario:** demo  
- **Contraseña:** demo

### Administrador
- **Usuario:** admin  
- **Contraseña:** 1234

---

## Primeros pasos

### Requisitos

Asegúrate de tener instalado lo siguiente:

- Java 11 o superior  
- Maven  
- Node.js y npm  
- Angular CLI  
- PostgreSQL  
- Postman (opcional, para pruebas API)

---

## Ejecutar el proyecto desde tu IDE o usando Maven:


```
mvn spring-boot:run
```

## Ejecutar frontend

```bash
ng serve
```

La aplicación estará disponible en:

```
http://localhost:4200
```

---

## Documentación de referencia

- [Documentación oficial de Maven](https://maven.apache.org/guides/index.html)  
- [Guía del plugin Spring Boot para Maven](https://docs.spring.io/spring-boot/docs/2.7.7/maven-plugin/reference/html/)  
- [Crear una imagen OCI](https://docs.spring.io/spring-boot/docs/2.7.7/maven-plugin/reference/html/#build-image)  
- [Spring Web](https://docs.spring.io/spring-boot/docs/2.7.7/reference/htmlsingle/#web)  
- [Spring Data JPA](https://docs.spring.io/spring-boot/docs/2.7.7/reference/htmlsingle/#data.sql.jpa-and-spring-data)  
- [Spring Session](https://docs.spring.io/spring-session/reference/)

---

## Guías prácticas

- [Crear un servicio web RESTful](https://spring.io/guides/gs/rest-service/)  
- [Servir contenido web con Spring MVC](https://spring.io/guides/gs/serving-web-content/)  
- [Construir servicios REST con Spring](https://spring.io/guides/tutorials/rest/)  
- [Acceder a datos con JPA](https://spring.io/guides/gs/accessing-data-jpa/)
