import axios from "axios";

// Función para registrar un nuevo usuario
const registrarUsuario = async (nombre, email, password, rol) => {
    try {
        const response = await axios.post('https://api.gobslayer.com/user/register', {
            nombre,
            email,
            password,
            rol
        });
        console.log(`✅ Usuario ${email} registrado exitosamente.`);
    } catch (error) {
        console.error(`❌ Error al registrar ${email}:`, error.response ? error.response.data : error.message);
    }
};

// Función para esperar cierta cantidad de milisegundos
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Función para generar usuarios y registrarlos uno por uno
const crearUsuarios = async () => {
    const fechaHora = new Date().toISOString().replace(/[-:]/g, '').replace('T', '_'); // Sufijo único
    const totalUsuarios = 10000; // Cantidad de usuarios a crear

    for (let i = 0; i <= totalUsuarios; i++) {
        const nombre = `nombre${i}`;
        const email = `usuario${i}_${fechaHora}@example.com`;
        const password = `Contraseña${i}@123`;
        const rol = 'photographer';

        await registrarUsuario(nombre, email, password, rol);

        // Esperar 1 segundo antes de registrar el siguiente
        await delay(1000);
    }
};

// Ejecutar la función principal
crearUsuarios();
