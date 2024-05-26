const Hapi = require('@hapi/hapi');

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: '0.0.0.0'
    });

    server.route({
        method: 'POST',
        path: '/api/detect-disease',
        handler: async (request, h) => {
            const { message } = request.payload;
            // Panggil layanan ML untuk mendapatkan prediksi
            const prediction = await predictDisease(message);
            return h.response({ prediction }).code(200);
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
});

init();

async function predictDisease(message) {
    const response = await fetch(process.env.PREDICTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
    });
    const data = await response.json();
    return data.prediction;
}
