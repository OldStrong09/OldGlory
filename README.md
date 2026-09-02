# APEX LEDGER

**Trading Workspace · Demo / Manual**

Apex Ledger es una aplicación web independiente para practicar trading con una cuenta demo, convertir ideas en planes, controlar el riesgo y estudiar el historial de operaciones.

## Módulos

- **Dashboard:** capital, P&L, win rate, R:R medio, curva de equity, racha y panel de rendimiento.
- **Mercados:** gráficos TradingView integrados, selección de activo y timeframe.
- **Plan del setup:** entrada, Stop Loss, Take Profit, sesgo y tesis antes de registrar el trade.
- **Calculadora:** riesgo, distancia al stop, tamaño de posición, beneficio potencial y R:R.
- **Gestión de riesgo:** capital base, riesgo por operación, pérdida máxima diaria y máximo de operaciones.
- **Diario:** registro manual, búsqueda, filtros por resultado/dirección/sesión y edición/borrado.
- **Estadísticas:** ganancia/pérdida bruta, neto, Profit Factor y lectura rápida.
- **Análisis avanzado:** expectativa, win rate, promedios, drawdown, rachas y rendimiento por activo, estrategia y sesión.
- **Checklist:** filtro de disciplina antes de una entrada.
- **Backup:** exportación e importación de los datos en JSON.
- **PWA:** instalable como aplicación y con shell offline para los archivos locales.

## Flujo recomendado

**Analizar → Planificar → Calcular riesgo → Checklist → Ejecutar manualmente en demo → Registrar → Revisar → Mejorar.**

1. Configura capital y límites en la gestión de riesgo.
2. Estudia el mercado y escribe la tesis.
3. Define Entrada, SL, TP y sesgo.
4. Comprueba el tamaño de posición con la calculadora.
5. Pasa el checklist antes de considerar la entrada.
6. Ejecuta solo en un entorno demo/manual externo.
7. Registra resultado, estrategia, sesión y notas.
8. Revisa expectativa, drawdown, Profit Factor y rendimiento por sesión/estrategia.
9. Exporta un backup JSON periódicamente.

## Calculadora: importante

El cálculo de tamaño es **orientativo**. En Forex, oro/CFD y otros instrumentos el valor monetario real depende del contrato, pip/tick, divisa de la cuenta y condiciones del broker. Comprueba siempre la especificación del instrumento antes de utilizar cualquier cifra fuera de esta demo.

## Seguridad y alcance

Apex Ledger **no ejecuta órdenes**, **no conecta con brokers** y **no contiene automatización de trading real**. Los datos de operaciones, configuración de riesgo y planes se almacenan localmente en el navegador en esta versión.

Esto es una herramienta de formación, simulación y registro, no asesoramiento financiero ni una promesa de rentabilidad.

## Stack

HTML · CSS · JavaScript vanilla · TradingView widget · LocalStorage · PWA Service Worker · GitHub Actions

## Estado

**Versión demo funcional / manual.** La arquitectura está preparada para evolucionar hacia sincronización segura, autenticación y nuevas herramientas de análisis sin exponer credenciales de brokers en el navegador.
