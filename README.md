# APEX LEDGER

**Trading Workspace · Demo / Manual**

Apex Ledger es una aplicación web independiente para practicar trading con una cuenta demo, convertir ideas en planes, controlar el riesgo y estudiar el historial de operaciones.

## Módulos

- **Dashboard:** capital, P&L, win rate, R:R medio, curva de equity y racha.
- **Mercados:** gráficos TradingView integrados, selección de activo y timeframe.
- **Calculadora:** riesgo, distancia al stop, tamaño de posición, beneficio potencial y R:R.
- **Gestión de riesgo:** capital base, riesgo por operación, pérdida máxima diaria y máximo de operaciones.
- **Diario:** registro manual de trades y resultados.
- **Estadísticas:** ganancia/pérdida bruta, neto, Profit Factor y lectura rápida.
- **Análisis avanzado:** expectativa, win rate, promedios, drawdown, rachas y rendimiento por activo.
- **Checklist:** filtro de disciplina antes de una entrada.
- **Backup:** exportación e importación de los datos en JSON.
- **PWA:** instalable como aplicación y con shell offline para los archivos locales.

## Cómo usarla

1. Abre la página publicada por GitHub Pages.
2. En **Calculadora**, configura capital y límites de riesgo.
3. En **Mercados**, estudia el activo y guarda tu tesis.
4. Ejecuta la operación únicamente en tu entorno demo/manual.
5. Regístrala en **Diario**.
6. Revisa **Estadísticas** después de acumular una muestra suficiente.
7. Usa **Backup → Exportar** periódicamente para guardar una copia.

## Seguridad y alcance

Apex Ledger **no ejecuta órdenes**, **no conecta con brokers** y **no contiene automatización de trading real**. Los datos de operaciones, configuración de riesgo y planes se almacenan localmente en el navegador en esta versión.

Esto es una herramienta de formación, simulación y registro, no asesoramiento financiero ni una promesa de rentabilidad.

## Stack

HTML · CSS · JavaScript vanilla · TradingView widget · LocalStorage · PWA Service Worker

## Estado

**Versión demo funcional / manual.** El siguiente salto técnico sería añadir backend seguro, autenticación, sincronización entre dispositivos y funciones de IA sin exponer credenciales en el navegador.
