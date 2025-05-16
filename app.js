const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot');
const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');

// Datos estáticos de destinos turísticos (sin campo imagen)
const destinos = [
    {
        id: 1,
        nombre: "Machu Picchu, Perú",
        dias: 3,
        noches: 2,
        precio: 850,
        descripcion: "Explora la mística ciudad inca de Machu Picchu, un Patrimonio de la Humanidad rodeado de montañas sagradas.",
        detalles: "Incluye: boletos de tren, entrada a Machu Picchu, hotel 3 estrellas, desayunos, guía bilingüe. Salidas diarias."
    },
    {
        id: 2,
        nombre: "Cancún, México",
        dias: 5,
        noches: 4,
        precio: 1200,
        descripcion: "Relájate en playas de arena blanca y descubre las ruinas mayas de Chichén Itzá.",
        detalles: "Incluye: vuelos, hotel 4 estrellas todo incluido, tours a cenotes y Chichén Itzá. Transporte desde el aeropuerto."
    },
    {
        id: 3,
        nombre: "París, Francia",
        dias: 4,
        noches: 3,
        precio: 1500,
        descripcion: "Vive el encanto de París con la Torre Eiffel, el Louvre y un crucero por el Sena.",
        detalles: "Incluye: vuelos, hotel céntrico, desayunos, entradas al Louvre, crucero por el Sena. Ideal para parejas."
    },
    {
        id: 4,
        nombre: "Río de Janeiro, Brasil",
        dias: 4,
        noches: 3,
        precio: 1000,
        descripcion: "Disfruta de las vibrantes playas de Copacabana y el icónico Cristo Redentor.",
        detalles: "Incluye: vuelos, hotel cerca de la playa, tour al Cristo Redentor y Pan de Azúcar, desayunos."
    }
];

// Flujo para "Quiénes Somos"
const flowQuienesSomos = addKeyword(EVENTS.ACTION)
    .addAnswer(
        "🌟 *Viajes Turísticos Estrella* 🌟\n" +
        "Somos una agencia con 10 años de experiencia creando aventuras inolvidables. " +
        "Nuestra pasión es llevarte a los destinos más espectaculares del mundo con paquetes personalizados.\n" +
        "¡Tu viaje soñado comienza con nosotros!"
    )
    .addAnswer(
        "👉 ¿Qué quieres hacer ahora?\n" +
        "1. Volver al menú principal\n" +
        "2. Finalizar",
        { capture: true },
        async (ctx, { flowDynamic, gotoFlow }) => {
            const opcion = ctx.body;
            if (opcion === "1") {
                return gotoFlow(flowMenuPrincipal);
            } else if (opcion === "2") {
                await flowDynamic("¡Gracias por visitarnos! Escribe 'hola viajes' cuando quieras volver. 😊");
                return;
            } else {
                await flowDynamic("Por favor, selecciona 1 o 2.");
                return gotoFlow(flowQuienesSomos);
            }
        }
    );

// Flujo para "Dónde Estamos"
const flowDondeEstamos = addKeyword(EVENTS.ACTION)
    .addAnswer(
        "📍 *Nuestra Ubicación*\n" +
        "Estamos en: Av. Sol 123, Centro, Ciudad Estrella\n" +
        "Horario: Lunes a Viernes, 9:00 AM - 6:00 PM\n" +
        "📧 Email: reservas@viajesestrella.com\n" +
        "📱 Teléfono: +123 456 7890"
    )
    .addAnswer(
        "👉 ¿Qué quieres hacer ahora?\n" +
        "1. Volver al menú principal\n" +
        "2. Finalizar",
        { capture: true },
        async (ctx, { flowDynamic, gotoFlow }) => {
            const opcion = ctx.body;
            if (opcion === "1") {
                return gotoFlow(flowMenuPrincipal);
            } else if (opcion === "2") {
                await flowDynamic("¡Gracias por visitarnos! Escribe 'hola viajes' cuando quieras volver. 😊");
                return;
            } else {
                await flowDynamic("Por favor, selecciona 1 o 2.");
                return gotoFlow(flowDondeEstamos);
            }
        }
    );

// Flujo para "Contacto"
const flowContacto = addKeyword(EVENTS.ACTION)
    .addAnswer(
        "📞 *Contáctanos*\n" +
        "Estamos listos para ayudarte a planear tu viaje:\n" +
        "- 📱 WhatsApp: +123 456 7890\n" +
        "- 📧 Email: reservas@viajesestrella.com\n" +
        "- 🌐 Web: www.viajesestrella.com\n" +
        "¡Escríbenos y empecemos tu aventura!"
    )
    .addAnswer(
        "👉 ¿Qué quieres hacer ahora?\n" +
        "1. Volver al menú principal\n" +
        "2. Finalizar",
        { capture: true },
        async (ctx, { flowDynamic, gotoFlow }) => {
            const opcion = ctx.body;
            if (opcion === "1") {
                return gotoFlow(flowMenuPrincipal);
            } else if (opcion === "2") {
                await flowDynamic("¡Gracias por visitarnos! Escribe 'hola viajes' cuando quieras volver. 😊");
                return;
            } else {
                await flowDynamic("Por favor, selecciona 1 o 2.");
                return gotoFlow(flowContacto);
            }
        }
    );

// Flujo para más detalles de un destino
const flowDetalles = addKeyword(EVENTS.ACTION)
    .addAnswer(
        "ℹ️ *Detalles del Destino*",
        null,
        async (ctx, { flowDynamic, state }) => {
            const destino = state.getMyState()?.destino;
            if (!destino) {
                await flowDynamic("Error: No se encontró el destino. Vuelve a intentarlo.");
                return gotoFlow(flowDestinos);
            }
            await flowDynamic(
                `🌟 *${destino.nombre}*\n` +
                `${destino.descripcion}\n` +
                `📅 Duración: ${destino.dias} días / ${destino.noches} noches\n` +
                `💰 Precio: $${destino.precio}\n` +
                `ℹ️ ${destino.detalles}`
            );
        }
    )
    .addAnswer(
        "👉 ¿Qué quieres hacer ahora?\n" +
        "1. Volver a destinos\n" +
        "2. Volver al menú principal\n" +
        "3. Finalizar",
        { capture: true },
        async (ctx, { flowDynamic, gotoFlow }) => {
            const opcion = ctx.body;
            switch (opcion) {
                case "1":
                    return gotoFlow(flowDestinos);
                case "2":
                    return gotoFlow(flowMenuPrincipal);
                case "3":
                    await flowDynamic("¡Gracias por visitarnos! Escribe 'hola viajes' cuando quieras volver. 😊");
                    return;
                default:
                    await flowDynamic("Por favor, selecciona 1, 2 o 3.");
                    return gotoFlow(flowDetalles);
            }
        }
    );

// Flujo para mostrar y seleccionar destinos
const flowDestinos = addKeyword(EVENTS.ACTION)
    .addAnswer(
        "✈️ *Nuestros Destinos Turísticos* ✈️\n" +
        destinos.map(d => `${d.id}. ${d.nombre}`).join('\n') +
        "\n\nEscribe el número del destino para más información."
    )
    .addAnswer(
        "🌍 Selecciona un destino (número):",
        { capture: true },
        async (ctx, { flowDynamic, gotoFlow, state }) => {
            const opcion = parseInt(ctx.body);
            const destino = destinos.find(d => d.id === opcion);
            if (!destino) {
                await flowDynamic("⚠️ Opción no válida. Por favor, selecciona un número válido.");
                return gotoFlow(flowDestinos);
            }

            // Guardar destino seleccionado
            await state.update({ destino });

            // Enviar detalles completos del destino
            await flowDynamic(
                `🌟 *${destino.nombre}*\n` +
                `${destino.descripcion}\n` +
                `📅 Duración: ${destino.dias} días / ${destino.noches} noches\n` +
                `💰 Precio: $${destino.precio}\n` +
                `ℹ️ ${destino.detalles}`
            );

            // Opciones después de seleccionar destino
            await flowDynamic(
                "👉 ¿Qué quieres hacer?\n" +
                "1. Volver a destinos\n" +
                "2. Volver al menú principal\n" +
                "3. Finalizar"
            );
            return gotoFlow(flowOpcionesDestino);
        }
    );

// Flujo para opciones después de seleccionar un destino
const flowOpcionesDestino = addKeyword(EVENTS.ACTION)
    .addAnswer(
        "Selecciona una opción (número):",
        { capture: true },
        async (ctx, { flowDynamic, gotoFlow }) => {
            const opcion = ctx.body;
            switch (opcion) {
                case "1":
                    return gotoFlow(flowDestinos);
                case "2":
                    return gotoFlow(flowMenuPrincipal);
                case "3":
                    await flowDynamic("¡Gracias por visitarnos! Escribe 'hola viajes' cuando quieras volver. 😊");
                    return;
                default:
                    await flowDynamic("⚠️ Por favor, selecciona 1, 2 o 3.");
                    return gotoFlow(flowOpcionesDestino);
            }
        }
    );

// Flujo del menú principal
const flowMenuPrincipal = addKeyword(EVENTS.ACTION)
    .addAnswer(
        "🌟 *Bienvenido a Viajes Turísticos Estrella* 🌟\n" +
        "¡Planifica tu aventura con nosotros! ¿Qué quieres explorar?\n\n" +
        "1. ✈️ Ver destinos turísticos\n" +
        "2. ℹ️ Quiénes somos\n" +
        "3. 📍 Dónde estamos\n" +
        "4. 📞 Contacto\n" +
        "5. 👋 Finalizar\n\n" +
        "Escribe el número de la opción:"
    )
    .addAnswer(
        "Selecciona una opción:",
        { capture: true },
        async (ctx, { flowDynamic, gotoFlow }) => {
            const opcion = ctx.body;
            switch (opcion) {
                case "1":
                    return gotoFlow(flowDestinos);
                case "2":
                    return gotoFlow(flowQuienesSomos);
                case "3":
                    return gotoFlow(flowDondeEstamos);
                case "4":
                    return gotoFlow(flowContacto);
                case "5":
                    await flowDynamic("¡Gracias por visitarnos! Escribe 'hola viajes' cuando quieras volver. 😊");
                    return;
                default:
                    await flowDynamic("⚠️ Opción no válida. Por favor, selecciona 1, 2, 3, 4 o 5.");
                    return gotoFlow(flowMenuPrincipal);
            }
        }
    );

// Flujo principal
const flowPrincipal = addKeyword(['hola viajes'], { sensitive: true })
    .addAnswer('¡Hola, viajero! Bienvenido a *Viajes Turísticos Estrella* 🌟')
    .addAnswer(
        "Estamos aquí para llevarte a los destinos más increíbles del mundo. 🗺️\n" +
        "¿Listo para comenzar?",
        null,
        async (ctx, { gotoFlow }) => {
            return gotoFlow(flowMenuPrincipal);
        }
    );

const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([
        flowPrincipal,
        flowMenuPrincipal,
        flowDestinos,
        flowOpcionesDestino,
        flowDetalles,
        flowQuienesSomos,
        flowDondeEstamos,
        flowContacto
    ]);
    const adapterProvider = createProvider(BaileysProvider);

    const bot = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });

    QRPortalWeb();

    adapterProvider.on('ready', () => {
        console.log('WhatsApp Provider está listo');
    });

    adapterProvider.on('error', (err) => {
        console.error('Error en el provider:', err);
    });
};

main().catch(err => console.error('Error en main:', err));