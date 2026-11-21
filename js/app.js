
document.addEventListener("DOMContentLoaded", () => {
    const STORAGE_KEY = "meu_plano_acao_universal_v4";

    const CURRENCIES = [
        { code: "EUR", symbol: "€", label: "Euro (€)" },
        { code: "USD", symbol: "$", label: "Dólar Americano ($)" },
        { code: "BRL", symbol: "R$", label: "Real Brasileiro (R$)" },
        { code: "GBP", symbol: "£", label: "Libra Esterlina (£)" },
        { code: "AOA", symbol: "Kz", label: "Kwanza Angolano (Kz)" },
        { code: "CHF", symbol: "CHF", label: "Franco Suíço (CHF)" }
    ];

    const planTextIds = [
        "m1_onde_estou", "m1_onde_quero_chegar", "m1_porque",
        "m2_eliminar", "m2_recursos",
        "m4_expectativa_etapa", "m4_preciso_saber", "m4_conclusao_etapa",
        "m4_expectativa_ciclo", "m4_conclusao_ciclo"
    ];

    function uid(prefix = "id") {
        return prefix + "_" + Math.random().toString(36).slice(2, 9);
    }

    function makeStage(name, weight, tasks = [], expectation = "", needsToKnow = "", conclusion = "", completed = false, startedAt = "", finishedAt = "", actualHours = "") {
        return {
            id: uid("stg"),
            name,
            weight: Math.max(1, Number(weight) || 1),
            completed: Boolean(completed),
            startedAt,
            finishedAt,
            actualHours,
            expectation,
            needsToKnow,
            conclusion,
            tasks: tasks.map(t => typeof t === "string"
                ? { id: uid("tsk"), title: t, done: false }
                : { id: t.id || uid("tsk"), title: t.title || "", done: Boolean(t.done) })
        };
    }

    const PRESETS = {
        musica: {
            fields: {
                m1_onde_estou: "Tenho trabalho fixo, pouco tempo livre diário e várias obrigações, mas quero fechar entregas consistentes.",
                m1_onde_quero_chegar: "Ter uma música pronta para lançamento no fim deste ciclo.",
                m1_porque: "Para manter autodisciplina, transformar ideia em obra real e ganhar ritmo contínuo.",
                m2_eliminar: "Distrações, começar várias ideias ao mesmo tempo e deixar sessões sem foco.",
                m2_recursos: "Conhecimento de produção, independência técnica, DAW pronta e blocos de tempo livre.",
                m4_expectativa_etapa: "Fechar a base harmónica e melódica com clareza nesta etapa.",
                m4_preciso_saber: "Definir o andamento, tonalidade e sensação emocional antes de avançar para arranjos.",
                m4_conclusao_etapa: "",
                m4_expectativa_ciclo: "Concluir todas as etapas até ter o tema pronto para lançar.",
                m4_conclusao_ciclo: ""
            },
            cycle: {
                mode: "1m",
                customWeeks: 4,
                hoursPerSession: 2,
                sessionsPerWeek: 4,
                evalMode: "progress",
                currency: "EUR",
                nonMoneyMetric: "marcos e tarefas concluídas",
                targetValue: 100
            },
            activeStageIndex: 0,
            stages: [
                makeStage("Etapa 1: Harmonia e Melodia", 3, ["Definir ideia e tonalidade", "Criar progressão harmónica", "Testar linhas melódicas"], "Construir uma base harmónica forte.", "Qual o clima/ritmo principal do tema.", "", false),
                makeStage("Etapa 2: Arranjo e Estrutura", 3, ["Montar estrutura na DAW", "Criar baterias/percussão", "Ajustar transições"], "Ter a estrutura completa do início ao fim.", "Onde entram variações e quebras.", "", false),
                makeStage("Etapa 3: Voz e Detalhes", 2, ["Gravar/trabalhar vozes ou leads", "Refinar timbres e camadas"], "Dar identidade e emoção à faixa.", "Que detalhes acrescentam sem pesar.", "", false),
                makeStage("Etapa 4: Mistura, Master e Fecho", 2, ["Equilibrar volumes e frequências", "Fazer master final", "Validar para lançamento"], "Fechar o som com qualidade pronta a lançar.", "Conferir consistência em diferentes colunas/auscultadores.", "", false)
            ],
            history: []
        },
        financas: {
            fields: {
                m1_onde_estou: "Tenho rendimento fixo, despesas recorrentes e quero criar margem financeira estruturada.",
                m1_onde_quero_chegar: "Construir reserva e validar fonte extra de rendimento dentro do ciclo.",
                m1_porque: "Para dar mais tranquilidade financeira e liberdade de decisão.",
                m2_eliminar: "Gastos impulsivos, subscrições sem uso e improvisos no orçamento.",
                m2_recursos: "Organização, capacidade de trabalho e conhecimento prático.",
                m4_expectativa_etapa: "Levantar todos os gastos fixos e variáveis do mês atual.",
                m4_preciso_saber: "Onde está a fugir dinheiro todas as semanas.",
                m4_conclusao_etapa: "",
                m4_expectativa_ciclo: "Ter plano financeiro ativo e meta de valor alcançada no ciclo.",
                m4_conclusao_ciclo: ""
            },
            cycle: {
                mode: "3m",
                customWeeks: 12,
                hoursPerSession: 2,
                sessionsPerWeek: 3,
                evalMode: "money",
                currency: "EUR",
                nonMoneyMetric: "marcos concluídos",
                targetValue: 1500
            },
            activeStageIndex: 0,
            stages: [
                makeStage("Etapa 1: Raio-X Financeiro", 2, ["Listar entradas e despesas fixas", "Identificar cortes rápidos"], "Clareza total sobre os números atuais.", "Valor exato do défice ou sobra mensal.", "", false),
                makeStage("Etapa 2: Estrutura de Reserva", 3, ["Definir valor automático por ciclo", "Criar regra de separação"], "Começar a acumular sem depender de sobras.", "Quanto consigo separar com segurança.", "", false),
                makeStage("Etapa 3: Geração Extra", 5, ["Definir oferta ou ação prática", "Executar contactos/entregas", "Acompanhar retorno"], "Gerar valor real acima do ponto inicial.", "Qual ação traz retorno mais rápido.", "", false)
            ],
            history: []
        }
    };

    function defaultState() {
        const fields = {};
        planTextIds.forEach(id => { fields[id] = ""; });
        return {
            fields,
            cycle: {
                mode: "1m",
                customWeeks: 4,
                hoursPerSession: 2,
                sessionsPerWeek: 4,
                evalMode: "progress",
                currency: "EUR",
                nonMoneyMetric: "marcos e tarefas concluídas",
                targetValue: 100
            },
            activeStageIndex: 0,
            stages: [
                makeStage("Etapa 1", 2, ["Definir o ponto de partida", "Executar a primeira tarefa concreta"], "", "", "", false),
                makeStage("Etapa 2", 3, ["Desenvolver o núcleo da etapa", "Rever e ajustar"], "", "", "", false),
                makeStage("Etapa 3", 2, ["Concluir e validar entrega"], "", "", "", false)
            ],
            history: []
        };
    }

    let state = defaultState();

    // Elementos DOM
    const currencySelect = document.getElementById("currencySelect");
    const moneyTargetBox = document.getElementById("moneyTargetBox");
    const nonMoneyBox = document.getElementById("nonMoneyBox");
    const targetValueInput = document.getElementById("targetValueInput");
    const nonMoneyMetricInput = document.getElementById("nonMoneyMetricInput");
    const targetValueLabel = document.getElementById("targetValueLabel");

    const cycleModeSelect = document.getElementById("cycleModeSelect");
    const customWeeksBox = document.getElementById("customWeeksBox");
    const customWeeksInput = document.getElementById("customWeeksInput");
    const hoursPerSessionInput = document.getElementById("hoursPerSessionInput");
    const sessionsPerWeekInput = document.getElementById("sessionsPerWeekInput");

    const sumTotalHours = document.getElementById("sumTotalHours");
    const sumTotalWeight = document.getElementById("sumTotalWeight");
    const sumDoneStages = document.getElementById("sumDoneStages");

    const stagesListEl = document.getElementById("stagesList");
    const activeStageSelect = document.getElementById("activeStageSelect");
    const activeStageTasksPreview = document.getElementById("activeStageTasksPreview");

    const progressFill = document.getElementById("progressFill");
    const progressText = document.getElementById("progressText");
    const historyListEl = document.getElementById("historyList");

    function populateCurrencies() {
        currencySelect.innerHTML = "";
        CURRENCIES.forEach(c => {
            const opt = document.createElement("option");
            opt.value = c.code;
            opt.textContent = c.label;
            currencySelect.appendChild(opt);
        });
    }

    function getCycleWeeks() {
        const m = state.cycle.mode;
        if (m === "1w") return 1;
        if (m === "1m") return 4;
        if (m === "2m") return 8;
        if (m === "4m") return 16;
        if (m === "1y") return 52;
        return Math.max(1, Number(state.cycle.customWeeks) || 4);
    }

    function getTotalCycleHours() {
        const weeks = getCycleWeeks();
        const hps = Math.max(0.25, Number(state.cycle.hoursPerSession) || 1);
        const spw = Math.max(1, Number(state.cycle.sessionsPerWeek) || 1);
        return Math.round(weeks * spw * hps * 10) / 10;
    }

    function getStageAllocatedHours(stageIndex) {
        const totalHours = getTotalCycleHours();
        const totalWeight = state.stages.reduce((acc, s) => acc + Math.max(1, Number(s.weight) || 1), 0) || 1;
        const w = Math.max(1, Number(state.stages[stageIndex]?.weight) || 1);
        return Math.round(((w / totalWeight) * totalHours) * 10) / 10;
    }

    function getCurrencySymbol() {
        const found = CURRENCIES.find(c => c.code === state.cycle.currency);
        return found ? found.symbol : "€";
    }

    function saveState() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        updateSummaryAndProgress();
        renderActiveStagePreview();
    }

    function updateSummaryAndProgress() {
        const totalHours = getTotalCycleHours();
        const totalWeight = state.stages.reduce((acc, s) => acc + Math.max(1, Number(s.weight) || 1), 0);
        const doneCount = state.stages.filter(s => s.completed).length;

        sumTotalHours.textContent = `${totalHours} h`;
        sumTotalWeight.textContent = `${totalWeight}`;
        sumDoneStages.textContent = `${doneCount} / ${state.stages.length}`;

        const baseFields = ["m1_onde_estou", "m1_onde_quero_chegar", "m1_porque", "m2_eliminar", "m2_recursos"];
        let filled = baseFields.filter(id => (state.fields[id] || "").trim().length > 2).length;
        if (state.stages.length > 0 && state.stages.every(s => (s.name || "").trim().length > 0)) filled++;
        const percent = Math.round((filled / (baseFields.length + 1)) * 100);
        progressFill.style.width = percent + "%";
        progressText.textContent = `${percent}% do plano base estruturado`;

        // Atualizar horas exibidas em cada cartão de etapa sem perder foco dos inputs
        document.querySelectorAll("[data-stage-hours-pill]").forEach(pill => {
            const idx = Number(pill.getAttribute("data-stage-hours-pill"));
            if (!Number.isNaN(idx) && state.stages[idx]) {
                pill.textContent = `⏱️ Tempo alocado: ${getStageAllocatedHours(idx)} h`;
            }
        });
    }

    function syncEvalModeUI() {
        const isMoney = state.cycle.evalMode === "money";
        document.querySelectorAll(".eval-mode-btn").forEach(btn => {
            btn.classList.toggle("active", btn.getAttribute("data-eval") === state.cycle.evalMode);
        });
        moneyTargetBox.style.display = isMoney ? "block" : "none";
        nonMoneyBox.style.display = isMoney ? "none" : "block";
        const sym = getCurrencySymbol();
        targetValueLabel.textContent = `Meta numérica do ciclo (${sym})`;
    }

    function syncCycleModeUI() {
        customWeeksBox.style.display = state.cycle.mode === "custom" ? "block" : "none";
    }

    function escapeHTML(str) {
        if (!str) return "";
        return String(str).replace(/[&<>'"]/g, tag => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
        }[tag]));
    }

    function renderStages() {
        if (!Array.isArray(state.stages) || state.stages.length === 0) {
            state.stages = [makeStage("Etapa 1", 1, ["Primeira tarefa"])];
        }
        if (state.activeStageIndex >= state.stages.length) {
            state.activeStageIndex = Math.max(0, state.stages.length - 1);
        }

        stagesListEl.innerHTML = "";
        state.stages.forEach((stage, idx) => {
            const card = document.createElement("div");
            card.className = "stage-card" + (stage.completed ? " done" : "");
            const allocatedH = getStageAllocatedHours(idx);
            const doneTasks = stage.tasks.filter(t => t.done).length;

            const tasksHtml = stage.tasks.map((t, tIdx) => `
                <div class="task-row ${t.done ? "completed" : ""}">
                    <input type="checkbox" ${t.done ? "checked" : ""} data-task-check="${idx}:${tIdx}" title="Marcar tarefa como concluída">
                    <input type="text" value="${escapeHTML(t.title)}" placeholder="Nome da tarefa..." data-task-title="${idx}:${tIdx}">
                    <button type="button" class="btn btn-danger-light btn-sm" data-task-del="${idx}:${tIdx}" title="Remover tarefa">✕</button>
                </div>
            `).join("");

            card.innerHTML = `
                <div class="stage-header">
                    <div class="stage-title-group">
                        <span class="stage-num-badge">Etapa ${idx + 1}</span>
                        <span class="stage-hours-pill" data-stage-hours-pill="${idx}">⏱️ Tempo alocado: ${allocatedH} h</span>
                        <span style="font-size:0.88rem; font-weight:700; color:var(--text-muted);">Tarefas: ${doneTasks}/${stage.tasks.length}</span>
                        ${stage.completed ? `<span style="font-size:0.86rem; font-weight:800; color:var(--secondary);">✔ Concluída</span>` : ""}
                    </div>
                    <div class="stage-actions">
                        <button type="button" class="btn btn-light btn-sm" data-stage-up="${idx}" ${idx === 0 ? "disabled" : ""}>↑ Subir</button>
                        <button type="button" class="btn btn-light btn-sm" data-stage-down="${idx}" ${idx === state.stages.length - 1 ? "disabled" : ""}>↓ Descer</button>
                        <button type="button" class="btn btn-secondary btn-sm" data-stage-toggle-done="${idx}">${stage.completed ? "Reabrir Etapa" : "Marcar Feita"}</button>
                        <button type="button" class="btn btn-danger-light btn-sm" data-stage-del="${idx}">Remover</button>
                    </div>
                </div>

                <div class="stage-meta-grid">
                    <div>
                        <label style="font-size:0.92rem;">Nome da Etapa / Marco</label>
                        <input type="text" value="${escapeHTML(stage.name)}" placeholder="Ex.: Composição, Gravação, Mistura..." data-stage-name="${idx}">
                    </div>
                    <div>
                        <label style="font-size:0.92rem;">Peso / Importância</label>
                        <input type="number" min="1" max="100" value="${Number(stage.weight) || 1}" data-stage-weight="${idx}">
                    </div>
                    <div>
                        <label style="font-size:0.92rem;">Horas Reais Gastas (opcional)</label>
                        <input type="text" value="${escapeHTML(stage.actualHours || "")}" placeholder="Ex.: 3,5h" data-stage-actual-hours="${idx}">
                    </div>
                </div>

                <div class="tasks-box">
                    <div class="tasks-header">
                        <strong style="font-size:0.95rem;">Tarefas desta etapa (${stage.tasks.length})</strong>
                        <button type="button" class="btn btn-primary btn-sm" data-task-add="${idx}">+ Adicionar Tarefa</button>
                    </div>
                    <div class="tasks-list">
                        ${tasksHtml || `<p class="empty-msg" style="padding:10px;">Sem tarefas ainda. Clica em "+ Adicionar Tarefa".</p>`}
                    </div>
                </div>
            `;
            stagesListEl.appendChild(card);
        });

        bindStageEvents();
        renderActiveStageSelector();
        renderActiveStagePreview();
        updateSummaryAndProgress();
    }

    function bindStageEvents() {
        document.querySelectorAll("[data-stage-name]").forEach(inp => {
            inp.addEventListener("input", (e) => {
                const idx = Number(e.target.getAttribute("data-stage-name"));
                state.stages[idx].name = e.target.value;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
                renderActiveStageSelector();
                renderActiveStagePreview();
                updateSummaryAndProgress();
            });
        });

        document.querySelectorAll("[data-stage-weight]").forEach(inp => {
            inp.addEventListener("input", (e) => {
                const idx = Number(e.target.getAttribute("data-stage-weight"));
                state.stages[idx].weight = Math.max(1, Number(e.target.value) || 1);
                saveState();
            });
        });

        document.querySelectorAll("[data-stage-actual-hours]").forEach(inp => {
            inp.addEventListener("input", (e) => {
                const idx = Number(e.target.getAttribute("data-stage-actual-hours"));
                state.stages[idx].actualHours = e.target.value;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
            });
        });

        document.querySelectorAll("[data-stage-up]").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const idx = Number(e.target.getAttribute("data-stage-up"));
                if (idx <= 0) return;
                const temp = state.stages[idx - 1];
                state.stages[idx - 1] = state.stages[idx];
                state.stages[idx] = temp;
                if (state.activeStageIndex === idx) state.activeStageIndex = idx - 1;
                saveState();
                renderStages();
            });
        });

        document.querySelectorAll("[data-stage-down]").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const idx = Number(e.target.getAttribute("data-stage-down"));
                if (idx >= state.stages.length - 1) return;
                const temp = state.stages[idx + 1];
                state.stages[idx + 1] = state.stages[idx];
                state.stages[idx] = temp;
                if (state.activeStageIndex === idx) state.activeStageIndex = idx + 1;
                saveState();
                renderStages();
            });
        });

        document.querySelectorAll("[data-stage-toggle-done]").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const idx = Number(e.target.getAttribute("data-stage-toggle-done"));
                state.stages[idx].completed = !state.stages[idx].completed;
                saveState();
                renderStages();
            });
        });

        document.querySelectorAll("[data-stage-del]").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const idx = Number(e.target.getAttribute("data-stage-del"));
                if (state.stages.length <= 1) {
                    alert("Mantém pelo menos 1 etapa no ciclo.");
                    return;
                }
                state.stages.splice(idx, 1);
                if (state.activeStageIndex >= state.stages.length) state.activeStageIndex = state.stages.length - 1;
                saveState();
                renderStages();
            });
        });

        document.querySelectorAll("[data-task-add]").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const idx = Number(e.target.getAttribute("data-task-add"));
                state.stages[idx].tasks.push({ id: uid("tsk"), title: "", done: false });
                saveState();
                renderStages();
            });
        });

        document.querySelectorAll("[data-task-check]").forEach(chk => {
            chk.addEventListener("change", (e) => {
                const [sIdx, tIdx] = e.target.getAttribute("data-task-check").split(":").map(Number);
                state.stages[sIdx].tasks[tIdx].done = e.target.checked;
                saveState();
                renderStages();
            });
        });

        document.querySelectorAll("[data-task-title]").forEach(inp => {
            inp.addEventListener("input", (e) => {
                const [sIdx, tIdx] = e.target.getAttribute("data-task-title").split(":").map(Number);
                state.stages[sIdx].tasks[tIdx].title = e.target.value;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
                renderActiveStagePreview();
            });
        });

        document.querySelectorAll("[data-task-del]").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const [sIdx, tIdx] = e.target.getAttribute("data-task-del").split(":").map(Number);
                state.stages[sIdx].tasks.splice(tIdx, 1);
                saveState();
                renderStages();
            });
        });
    }

    function renderActiveStageSelector() {
        activeStageSelect.innerHTML = "";
        state.stages.forEach((st, idx) => {
            const opt = document.createElement("option");
            opt.value = String(idx);
            const labelName = (st.name || "").trim() || `Etapa ${idx + 1}`;
            opt.textContent = `Etapa ${idx + 1}: ${labelName} (${getStageAllocatedHours(idx)}h)${st.completed ? " ✔" : ""}`;
            activeStageSelect.appendChild(opt);
        });
        activeStageSelect.value = String(state.activeStageIndex || 0);
    }

    function renderActiveStagePreview() {
        const idx = Math.max(0, Math.min(state.stages.length - 1, Number(state.activeStageIndex) || 0));
        const st = state.stages[idx];
        if (!st) return;

        const name = (st.name || "").trim() || `Etapa ${idx + 1}`;
        const tasks = st.tasks.filter(t => (t.title || "").trim().length > 0);
        const taskItems = tasks.length > 0
            ? `<ul>${tasks.map(t => `<li>${t.done ? "✔ " : "• "}${escapeHTML(t.title)}</li>`).join("")}</ul>`
            : `<p style="color:var(--text-muted); margin-top:4px;">Nenhuma tarefa nomeada nesta etapa ainda.</p>`;

        activeStageTasksPreview.innerHTML = `
            <div><strong>Em foco agora:</strong> ${escapeHTML(name)} — <strong>Tempo estimado:</strong> ${getStageAllocatedHours(idx)} h — <strong>Peso:</strong> ${st.weight}</div>
            ${taskItems}
        `;

        document.getElementById("m4_expectativa_etapa").value = st.expectation || "";
        document.getElementById("m4_preciso_saber").value = st.needsToKnow || "";
        document.getElementById("m4_conclusao_etapa").value = st.conclusion || "";
    }

    function renderHistory() {
        if (!Array.isArray(state.history) || state.history.length === 0) {
            historyListEl.innerHTML = `<p class="empty-msg">Ainda não tens registos guardados. Guarda conclusões de etapas ou a conclusão final do ciclo quando terminares.</p>`;
            return;
        }
        historyListEl.innerHTML = "";
        state.history.forEach((entry, idx) => {
            const div = document.createElement("div");
            div.className = "history-item" + (entry.type === "cycle" ? " cycle-entry" : "");
            const badge = entry.type === "cycle" ? "🏁 CONCLUSÃO DO CICLO" : `📌 ETAPA: ${escapeHTML(entry.stageName || "Etapa")}`;
            div.innerHTML = `
                <div class="history-item-date">${badge} • 📅 ${escapeHTML(entry.date)}</div>
                ${entry.needsToKnow ? `<p><strong>O que precisava saber / pretendia:</strong> ${escapeHTML(entry.needsToKnow)}</p>` : ""}
                ${entry.expectation ? `<p><strong>Expectativa inicial:</strong> ${escapeHTML(entry.expectation)}</p>` : ""}
                <p><strong>Conclusão tirada:</strong> ${escapeHTML(entry.conclusion)}</p>
                <button type="button" class="btn-delete-item" data-hist-del="${idx}">✕ Remover</button>
            `;
            historyListEl.appendChild(div);
        });

        document.querySelectorAll("[data-hist-del]").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const idx = Number(e.target.getAttribute("data-hist-del"));
                if (confirm("Remover este registo do histórico?")) {
                    state.history.splice(idx, 1);
                    saveState();
                    renderHistory();
                }
            });
        });
    }

    function applyStateToUI() {
        planTextIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = (state.fields && state.fields[id]) || "";
        });

        currencySelect.value = state.cycle.currency || "EUR";
        targetValueInput.value = state.cycle.targetValue ?? 100;
        nonMoneyMetricInput.value = state.cycle.nonMoneyMetric || "marcos e tarefas concluídas";
        cycleModeSelect.value = state.cycle.mode || "1m";
        customWeeksInput.value = state.cycle.customWeeks || 4;
        hoursPerSessionInput.value = state.cycle.hoursPerSession || 2;
        sessionsPerWeekInput.value = state.cycle.sessionsPerWeek || 4;

        syncEvalModeUI();
        syncCycleModeUI();
        renderStages();
        renderHistory();
        updateSummaryAndProgress();
    }

    // Eventos globais
    planTextIds.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener("input", () => {
            state.fields[id] = el.value;
            const sIdx = Math.max(0, Math.min(state.stages.length - 1, Number(state.activeStageIndex) || 0));
            if (id === "m4_expectativa_etapa") state.stages[sIdx].expectation = el.value;
            if (id === "m4_preciso_saber") state.stages[sIdx].needsToKnow = el.value;
            if (id === "m4_conclusao_etapa") state.stages[sIdx].conclusion = el.value;
            saveState();
        });
    });

    document.querySelectorAll(".eval-mode-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            state.cycle.evalMode = btn.getAttribute("data-eval");
            syncEvalModeUI();
            saveState();
        });
    });

    currencySelect.addEventListener("change", (e) => {
        state.cycle.currency = e.target.value;
        syncEvalModeUI();
        saveState();
    });

    targetValueInput.addEventListener("input", (e) => {
        state.cycle.targetValue = Math.max(0, Number(e.target.value) || 0);
        saveState();
    });

    nonMoneyMetricInput.addEventListener("input", (e) => {
        state.cycle.nonMoneyMetric = e.target.value;
        saveState();
    });

    cycleModeSelect.addEventListener("change", (e) => {
        state.cycle.mode = e.target.value;
        syncCycleModeUI();
        saveState();
        renderStages();
    });

    customWeeksInput.addEventListener("input", (e) => {
        state.cycle.customWeeks = Math.max(1, Math.min(300, Number(e.target.value) || 1));
        saveState();
        renderStages();
    });

    hoursPerSessionInput.addEventListener("input", (e) => {
        state.cycle.hoursPerSession = Math.max(0.25, Math.min(24, Number(e.target.value) || 1));
        saveState();
        renderStages();
    });

    sessionsPerWeekInput.addEventListener("input", (e) => {
        state.cycle.sessionsPerWeek = Math.max(1, Math.min(35, Number(e.target.value) || 1));
        saveState();
        renderStages();
    });

    document.getElementById("btnAddStage").addEventListener("click", () => {
        const nextNum = state.stages.length + 1;
        state.stages.push(makeStage(`Etapa ${nextNum}`, 1, ["Definir tarefa desta etapa"]));
        state.activeStageIndex = state.stages.length - 1;
        saveState();
        renderStages();
    });

    activeStageSelect.addEventListener("change", (e) => {
        state.activeStageIndex = Number(e.target.value) || 0;
        saveState();
        renderActiveStagePreview();
    });

    document.getElementById("btnSaveStageLog").addEventListener("click", () => {
        const idx = Math.max(0, Math.min(state.stages.length - 1, Number(state.activeStageIndex) || 0));
        const st = state.stages[idx];
        const expectation = document.getElementById("m4_expectativa_etapa").value.trim();
        const needsToKnow = document.getElementById("m4_preciso_saber").value.trim();
        const conclusion = document.getElementById("m4_conclusao_etapa").value.trim();

        if (!conclusion) {
            alert("Escreve primeiro a conclusão desta etapa antes de marcar como feita e guardar.");
            return;
        }

        st.expectation = expectation;
        st.needsToKnow = needsToKnow;
        st.conclusion = conclusion;
        st.completed = true;

        const dateStr = new Date().toLocaleDateString("pt-PT", {
            day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
        });

        state.history.unshift({
            type: "stage",
            date: dateStr,
            stageName: (st.name || "").trim() || `Etapa ${idx + 1}`,
            expectation,
            needsToKnow,
            conclusion
        });

        if (idx + 1 < state.stages.length) {
            state.activeStageIndex = idx + 1;
        }

        saveState();
        renderStages();
        renderHistory();
        alert("Etapa registada como concluída!");
    });

    document.getElementById("btnSaveCycleLog").addEventListener("click", () => {
        const expectation = document.getElementById("m4_expectativa_ciclo").value.trim();
        const conclusion = document.getElementById("m4_conclusao_ciclo").value.trim();

        if (!conclusion) {
            alert("Escreve a conclusão final do ciclo antes de guardar no histórico.");
            return;
        }

        const dateStr = new Date().toLocaleDateString("pt-PT", {
            day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
        });

        state.history.unshift({
            type: "cycle",
            date: dateStr,
            stageName: "Ciclo Completo",
            expectation,
            needsToKnow: "",
            conclusion
        });

        saveState();
        renderHistory();
        alert("Conclusão final do ciclo guardada no histórico!");
    });

    document.getElementById("presetSelector").addEventListener("change", (e) => {
        const key = e.target.value;
        if (!key || !PRESETS[key]) return;
        if (confirm("Carregar este exemplo pronto por cima do plano atual?")) {
            const p = JSON.parse(JSON.stringify(PRESETS[key]));
            state = {
                fields: { ...defaultState().fields, ...p.fields },
                cycle: { ...defaultState().cycle, ...p.cycle },
                activeStageIndex: p.activeStageIndex || 0,
                stages: p.stages,
                history: p.history || []
            };
            saveState();
            applyStateToUI();
        }
        e.target.value = "";
    });

    document.getElementById("btnExport").addEventListener("click", () => {
        const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `meu-plano-de-acao-v4-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    });

    document.getElementById("fileImport").addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const parsed = JSON.parse(ev.target.result);
                if (parsed && typeof parsed === "object") {
                    const base = defaultState();
                    state = {
                        fields: { ...base.fields, ...(parsed.fields || {}) },
                        cycle: { ...base.cycle, ...(parsed.cycle || {}) },
                        activeStageIndex: Number(parsed.activeStageIndex) || 0,
                        stages: Array.isArray(parsed.stages) && parsed.stages.length > 0 ? parsed.stages : base.stages,
                        history: Array.isArray(parsed.history) ? parsed.history : []
                    };
                    saveState();
                    applyStateToUI();
                    alert("Plano v4 carregado com sucesso!");
                }
            } catch (err) {
                alert("Ficheiro JSON inválido.");
            }
        };
        reader.readAsText(file);
        e.target.value = "";
    });

    document.getElementById("btnPrint").addEventListener("click", () => window.print());

    document.getElementById("btnClear").addEventListener("click", () => {
        if (confirm("Tens a certeza que queres limpar tudo e começar do zero?")) {
            state = defaultState();
            saveState();
            applyStateToUI();
        }
    });

    function init() {
        populateCurrencies();
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                const base = defaultState();
                state = {
                    fields: { ...base.fields, ...(parsed.fields || {}) },
                    cycle: { ...base.cycle, ...(parsed.cycle || {}) },
                    activeStageIndex: Number(parsed.activeStageIndex) || 0,
                    stages: Array.isArray(parsed.stages) && parsed.stages.length > 0 ? parsed.stages : base.stages,
                    history: Array.isArray(parsed.history) ? parsed.history : []
                };
            } catch (e) {
                console.error(e);
            }
        }
        applyStateToUI();
    }

    init();
});
