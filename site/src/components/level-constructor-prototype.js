import { validateEquivalentLine, matchesSimplifiedExpression } from '../math/expression-engine.js?v=expression-engine-stage2-v10';

const TOKEN_LABELS = {
  x: "x", x2: "x²", plus: "+", minus: "−", times: "×", divide: "÷", equals: "=",
  open: "(", close: ")", fraction: "a/b",
  n0: "0", n1: "1", n2: "2", n3: "3", n4: "4", n5: "5", n6: "6", n7: "7", n8: "8", n9: "9",
  three: "3", nine: "9"
};

const SOURCE_EXPRESSION = [{
  type: "fraction",
  id: "source-fraction",
  numerator: ["open", "x2", "minus", "n9", "close"],
  denominator: ["open", "x", "minus", "n3", "close"]
}];

const ALGEBRA_IDS = ["x", "x2", "plus", "minus", "times", "divide", "equals", "open", "close"];
const NUMBER_IDS = ["n0", "n1", "n2", "n3", "n4", "n5", "n6", "n7", "n8", "n9"];
const STRUCTURE_IDS = ["fraction"];

const PROTOTYPE_EXERCISES = {
  1: {
    sourceTokens: [{
      type: "fraction",
      id: "source-fraction",
      numerator: ["open", "x2", "minus", "n4", "close"],
      denominator: ["open", "x", "minus", "n2", "close"]
    }],
    restrictedRoot: 2,
    targetTokens: ["x", "plus", "n2"],
    restrictionLabel: "x ≠ 2"
  },
  2: {
    sourceTokens: SOURCE_EXPRESSION,
    restrictedRoot: 3,
    targetTokens: ["x", "plus", "n3"],
    restrictionLabel: "x ≠ 3"
  }
};

export function createLevelConstructorPrototype(options = {}) {
  const levelId = [1, 2].includes(Number(options.levelId)) ? Number(options.levelId) : null;
  const exercise = PROTOTYPE_EXERCISES[levelId] || PROTOTYPE_EXERCISES[2];
  return {
    type: "construct-prototype",
    version: 5,
    levelId,
    sourceTokens: cloneTokens(exercise.sourceTokens),
    restrictedRoot: exercise.restrictedRoot,
    targetTokens: [...exercise.targetTokens],
    restrictionLabel: exercise.restrictionLabel,
    selectedTokenIndex: null,
    selectedTokenSlot: "line",
    selectedTokenFractionId: null,
    gaveUp: false,
    step: 0,
    completedLines: [],
    builtTokens: [],
    editingLineIndex: null,
    activeSlot: "line",
    activeFractionId: null,
    nextFractionId: 1,
    category: "symbols",
    checked: false,
    feedback: "",
    showHint: false,
    finished: false
  };
}

export function getPrototypeTokenLabel(tokenId) {
  return TOKEN_LABELS[tokenId] || tokenId;
}

function findFraction(tokens, id) {
  for (const token of tokens || []) {
    if (!token || typeof token !== "object" || token.type !== "fraction") continue;
    if (token.id === id) return token;
    const nested = findFraction(token.numerator, id) || findFraction(token.denominator, id);
    if (nested) return nested;
  }
  return null;
}

export function getPrototypeTargetTokens(run, slot = run.activeSlot, fractionId = run.activeFractionId) {
  if (slot === "line" || !fractionId) return run.builtTokens;
  const fraction = findFraction(run.builtTokens, fractionId);
  return fraction && Array.isArray(fraction[slot]) ? fraction[slot] : run.builtTokens;
}

function clearSelectedPrototypeToken(run) {
  run.selectedTokenIndex = null;
  run.selectedTokenSlot = "line";
  run.selectedTokenFractionId = null;
}

export function selectPrototypeSlot(run, slot, fractionId) {
  if (!run || run.type !== "construct-prototype") return;
  clearSelectedPrototypeToken(run);
  if (slot !== "numerator" && slot !== "denominator") {
    run.activeSlot = "line";
    run.activeFractionId = null;
    return;
  }
  if (!findFraction(run.builtTokens, fractionId)) return;
  run.activeSlot = slot;
  run.activeFractionId = fractionId;
}

export function selectPrototypeToken(run, index, slot = "line", fractionId = null) {
  if (!run || run.type !== "construct-prototype" || run.checked || run.finished) return false;
  const target = getPrototypeTargetTokens(run, slot, fractionId);
  if (!Array.isArray(target) || !Number.isInteger(index) || index < 0 ||
      index >= target.length || typeof target[index] !== "string") return false;
  const isAlreadySelected = run.selectedTokenIndex === index &&
    run.selectedTokenSlot === slot &&
    (run.selectedTokenFractionId || null) === (fractionId || null);
  if (isAlreadySelected) {
    clearSelectedPrototypeToken(run);
    return true;
  }
  run.selectedTokenIndex = index;
  run.selectedTokenSlot = slot;
  run.selectedTokenFractionId = fractionId || null;
  run.feedback = "";
  return true;
}

export function insertPrototypeToken(run, tokenId) {
  if (!run || run.type !== "construct-prototype" || run.checked || run.finished) return false;
  if (!Object.prototype.hasOwnProperty.call(TOKEN_LABELS, tokenId)) return false;

  const selectedIndex = run.selectedTokenIndex;
  const selectedSlot = run.selectedTokenSlot || "line";
  const selectedFractionId = run.selectedTokenFractionId || null;
  if (Number.isInteger(selectedIndex)) {
    const selectedTarget = getPrototypeTargetTokens(run, selectedSlot, selectedFractionId);
    if (Array.isArray(selectedTarget) && selectedIndex >= 0 && selectedIndex < selectedTarget.length) {
      if (tokenId === "fraction") {
        const id = "fraction-" + String(run.nextFractionId || 1);
        run.nextFractionId = Number(run.nextFractionId || 1) + 1;
        selectedTarget.splice(selectedIndex, 1, { type: "fraction", id, numerator: [], denominator: [] });
        run.activeSlot = "numerator";
        run.activeFractionId = id;
        run.category = "symbols";
      } else {
        selectedTarget.splice(selectedIndex, 1, tokenId);
        run.activeSlot = selectedSlot;
        run.activeFractionId = selectedFractionId;
      }
      clearSelectedPrototypeToken(run);
      run.feedback = "";
      return true;
    }
    clearSelectedPrototypeToken(run);
  }

  const target = getPrototypeTargetTokens(run);
  if (!Array.isArray(target)) return false;
  if (tokenId === "fraction") {
    const id = "fraction-" + String(run.nextFractionId || 1);
    run.nextFractionId = Number(run.nextFractionId || 1) + 1;
    target.push({ type: "fraction", id, numerator: [], denominator: [] });
    run.activeSlot = "numerator";
    run.activeFractionId = id;
    run.category = "symbols";
  } else {
    target.push(tokenId);
  }
  run.feedback = "";
  return true;
}

export function removePrototypeToken(run, index, slot = "line", fractionId = null) {
  if (!run || run.type !== "construct-prototype" || run.checked || run.finished) return false;
  const target = getPrototypeTargetTokens(run, slot, fractionId);
  if (!Array.isArray(target) || index < 0 || index >= target.length) return false;
  const removed = target.splice(index, 1)[0];
  clearSelectedPrototypeToken(run);
  if (removed && typeof removed === "object" && removed.type === "fraction" &&
      run.activeFractionId === removed.id) {
    run.activeSlot = "line";
    run.activeFractionId = null;
  }
  if (run.activeFractionId && !findFraction(run.builtTokens, run.activeFractionId)) {
    run.activeSlot = "line";
    run.activeFractionId = null;
  }
  run.feedback = "";
  return true;
}

export function undoPrototypeToken(run) {
  if (!run || run.type !== "construct-prototype" || run.checked || run.finished) return false;
  const target = getPrototypeTargetTokens(run);
  if (!Array.isArray(target) || !target.length) return false;
  const removed = target.pop();
  clearSelectedPrototypeToken(run);
  if (removed && typeof removed === "object" && removed.type === "fraction" &&
      run.activeFractionId === removed.id) {
    run.activeSlot = "line";
    run.activeFractionId = null;
  }
  run.feedback = "";
  return true;
}

export function clearPrototypeLine(run) {
  if (!run || run.type !== "construct-prototype" || run.checked || run.finished) return false;
  run.builtTokens = [];
  run.activeSlot = "line";
  run.activeFractionId = null;
  clearSelectedPrototypeToken(run);
  run.feedback = "";
  return true;
}

export function getPrototypeSolutionLines(run) {
  if (![1, 2].includes(Number(run?.levelId))) return [];
  const root = Number(run.levelId) === 1 ? 2 : 3;
  const numberToken = root === 2 ? "n2" : "n3";
  return [
    [{
      type: "fraction",
      id: "solution-fraction-" + root,
      numerator: ["open", "x", "minus", numberToken, "close", "times", "open", "x", "plus", numberToken, "close"],
      denominator: ["open", "x", "minus", numberToken, "close"]
    }],
    ["x", "plus", numberToken]
  ];
}

function cloneTokens(tokens) {
  return (tokens || []).map((token) => {
    if (typeof token === "string") return token;
    return {
      type: "fraction",
      id: token.id,
      numerator: cloneTokens(token.numerator),
      denominator: cloneTokens(token.denominator)
    };
  });
}

export function validatePrototypeLine(run) {
  return validateEquivalentLine(
    run?.builtTokens || [],
    run?.sourceTokens || SOURCE_EXPRESSION,
    run?.restrictedRoot ?? 3
  );
}

export function isPrototypeLineCorrect(run) {
  return validatePrototypeLine(run) === "correct";
}

export function isPrototypeFinalAnswer(tokens, run = null) {
  return matchesSimplifiedExpression(tokens || [], run?.targetTokens || ["x", "plus", "n3"]);
}

export function renderLevelConstructorPrototype(run, isPt) {
  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
  }[char]));
  const label = (pt, en) => isPt ? pt : en;
  const interactive = !run.checked && !run.finished;
  const sourceTokens = cloneTokens(run.sourceTokens || SOURCE_EXPRESSION);
  const finalAnswer = isPrototypeFinalAnswer(run.builtTokens, run);

  const renderTokens = (tokens, options = {}) => {
    const editable = !!options.editable;
    const slot = options.slot || "line";
    const fractionId = options.fractionId || "";
    return (tokens || []).map((token, index) => {
      if (typeof token === "string") {
        const text = getPrototypeTokenLabel(token);
        if (!editable) return '<span class="construct-read-token token-' + esc(token) + '">' + esc(text) + '</span>';
        const selected = run.selectedTokenIndex === index &&
          run.selectedTokenSlot === slot &&
          (run.selectedTokenFractionId || null) === (fractionId || null);
        return '<button type="button" class="construct-built-token token-' + esc(token) + (selected ? ' is-selected-token' : '') +
          '" data-action="prototype-select-token" data-token-index="' + index +
          '" data-slot="' + esc(slot) + '" data-fraction-id="' + esc(fractionId) + '" aria-pressed="' + selected + '" aria-label="' +
          esc(label("Seleccionar " + text + " para substituir", "Select " + text + " to replace")) + '">' + esc(text) + '</button>';
      }
      if (!token || token.type !== "fraction") return "";
      const activeTop = editable && run.activeSlot === "numerator" && run.activeFractionId === token.id;
      const activeBottom = editable && run.activeSlot === "denominator" && run.activeFractionId === token.id;
      const parentAttrs = 'data-slot="' + esc(slot) + '" data-fraction-id="' + esc(fractionId) + '" data-token-index="' + index + '"';
      const top = '<div class="construct-fraction-slot ' + (activeTop ? "is-active-slot" : "") + '" role="' + (editable ? "button" : "presentation") + '" tabindex="' + (editable ? "0" : "-1") +
        '"' + (editable ? ' data-action="prototype-select-slot" data-prototype-slot-zone="true"' : "") + ' data-prototype-slot="numerator" data-fraction-id="' + esc(token.id) +
        '" aria-label="' + esc(label("Seleccionar numerador", "Select numerator")) + '">' +
        renderTokens(token.numerator, { editable, slot: "numerator", fractionId: token.id }) +
        (editable && !token.numerator.length ? '<span class="construct-slot-placeholder">' + esc(label("em cima", "top")) + '</span>' : "") + '</div>';
      const bottom = '<div class="construct-fraction-slot ' + (activeBottom ? "is-active-slot" : "") + '" role="' + (editable ? "button" : "presentation") + '" tabindex="' + (editable ? "0" : "-1") +
        '"' + (editable ? ' data-action="prototype-select-slot" data-prototype-slot-zone="true"' : "") + ' data-prototype-slot="denominator" data-fraction-id="' + esc(token.id) +
        '" aria-label="' + esc(label("Seleccionar denominador", "Select denominator")) + '">' +
        renderTokens(token.denominator, { editable, slot: "denominator", fractionId: token.id }) +
        (editable && !token.denominator.length ? '<span class="construct-slot-placeholder">' + esc(label("em baixo", "bottom")) + '</span>' : "") + '</div>';
      const remove = editable
        ? '<button type="button" class="construct-fraction-remove" data-action="prototype-remove-token" ' + parentAttrs +
          ' aria-label="' + esc(label("Remover fracção", "Remove fraction")) + '">×</button>'
        : "";
      return '<span class="construct-fraction-node ' + ((activeTop || activeBottom) ? "has-active-slot" : "") + '">' +
        remove + top + '<span class="construct-fraction-rule"></span>' + bottom + '</span>';
    }).join("");
  };

  const renderRow = (number, tokens, rowClass, options = {}) => {
    let actions = "";
    if (options.lineIndex !== undefined && !run.finished && !run.checked && run.editingLineIndex === null) {
      actions = '<div class="construct-row-actions"><button type="button" data-action="prototype-edit-line" data-line-index="' + options.lineIndex +
        '" aria-label="' + esc(label("Editar linha " + number, "Edit line " + number)) + '" title="' + esc(label("Editar", "Edit")) + '">✎</button>' +
        '<button type="button" data-action="prototype-delete-line" data-line-index="' + options.lineIndex +
        '" aria-label="' + esc(label("Apagar linha " + number, "Delete line " + number)) + '" title="' + esc(label("Apagar", "Delete")) + '">×</button></div>';
    }
    const expressionAttrs = options.editable
      ? ' data-prototype-dropzone="true" data-action="prototype-select-slot" data-prototype-slot="line"'
      : "";
    return '<div class="construct-step ' + rowClass + '">' +
      '<span class="construct-step-index">' + esc(number) + '</span>' +
      '<div class="construct-step-main"><div class="construct-step-expression ' +
      (options.source ? "is-source" : "") + (options.editable ? " is-editable" : "") + '"' + expressionAttrs + '>' +
      renderTokens(tokens, { editable: !!options.editable }) + '</div>' + actions + '</div></div>';
  };

  const completedRows = (run.completedLines || []).map((tokens, index) => {
    if (run.editingLineIndex === index) {
      return renderRow(String(index + 2), run.builtTokens, "is-active", {
        editable: interactive,
        editing: true,
        lineIndex: undefined
      });
    }
    return renderRow(String(index + 2), tokens, "is-complete", { lineIndex: index });
  }).join("");

  const activeRow = !run.finished && run.editingLineIndex === null
    ? renderRow(String((run.completedLines || []).length + 2), run.builtTokens, "is-active", { editable: interactive })
    : "";

  const symbolTokens = ALGEBRA_IDS.map(tokenId =>
    '<button type="button" class="construct-token" draggable="' + interactive + '" data-action="prototype-add-token" data-prototype-token="' + tokenId + '"' +
    (!interactive ? " disabled" : "") + '><span>' + esc(getPrototypeTokenLabel(tokenId)) + '</span></button>'
  ).join("");
  const numberTokens = NUMBER_IDS.map(tokenId =>
    '<button type="button" class="construct-token construct-number-token" draggable="' + interactive + '" data-action="prototype-add-token" data-prototype-token="' + tokenId + '"' +
    (!interactive ? " disabled" : "") + '><span>' + esc(getPrototypeTokenLabel(tokenId)) + '</span></button>'
  ).join("");
  const structureTokens = STRUCTURE_IDS.map(tokenId =>
    '<button type="button" class="construct-token construct-token-structure" draggable="' + interactive + '" data-action="prototype-add-token" data-prototype-token="' + tokenId + '"' +
    (!interactive ? " disabled" : "") + '><span class="construct-token-fraction"><i>a</i><i></i><i>b</i></span></button>'
  ).join("");

  const isLevelOne = run.levelId === 1;
  const currentHint = (run.completedLines || []).length === 0
    ? label(
        isLevelOne
          ? "x² − 4 é uma diferença de quadrados: x² − 2² = (x − 2)(x + 2). Mantém o denominador igual."
          : "x² − 9 é uma diferença de quadrados: x² − 3² = (x − 3)(x + 3). Mantém o denominador igual.",
        isLevelOne
          ? "x² − 4 is a difference of squares: x² − 2² = (x − 2)(x + 2). Keep the denominator unchanged."
          : "x² − 9 is a difference of squares: x² − 3² = (x − 3)(x + 3). Keep the denominator unchanged."
      )
    : label(
        isLevelOne
          ? "O factor (x − 2) aparece em cima e em baixo. Como x ≠ 2, podes simplificar os factores comuns."
          : "O factor (x − 3) aparece em cima e em baixo. Como x ≠ 3, podes simplificar os factores comuns.",
        isLevelOne
          ? "The factor (x − 2) appears in both numerator and denominator. Since x ≠ 2, you can cancel the common factors."
          : "The factor (x − 3) appears in both numerator and denominator. Since x ≠ 3, you can cancel the common factors."
      );
  const feedback = run.feedback === "invalid"
    ? '<div class="construct-feedback" role="status"><span class="construct-feedback-mark">!</span><span>' +
      esc(label("A expressão está incompleta ou tem um denominador inválido. Revê os parênteses e as fracções.", "The expression is incomplete or has an invalid denominator. Check the brackets and fractions.")) +
      '</span></div>'
    : run.feedback === "restriction"
      ? '<div class="construct-feedback" role="status"><span class="construct-feedback-mark">!</span><span>' +
        esc(label("Esta forma altera o domínio da expressão original. Mantém " + (run.restrictionLabel || "x ≠ 3") + ".", "This form changes the original domain. Preserve " + (run.restrictionLabel || "x ≠ 3") + ".")) +
        '</span></div>'
      : run.feedback === "equivalence" || run.feedback === "wrong"
        ? '<div class="construct-feedback" role="status"><span class="construct-feedback-mark">↺</span><span>' +
          esc(label("Esta linha não é equivalente à expressão de partida. Revê os sinais e os factores.", "This line is not equivalent to the starting expression. Check the signs and factors.")) +
          '</span></div>'
        : run.feedback === "final"
          ? '<div class="construct-feedback is-correct" role="status"><span class="construct-feedback-mark">✓</span><span>' +
            esc(label("Forma simplificada encontrada.", "Simplified form found.")) + '</span></div>'
          : run.feedback === "correct"
            ? '<div class="construct-feedback is-correct" role="status"><span class="construct-feedback-mark">✓</span><span>' +
              esc(label("Transformação válida.", "Valid transformation.")) + '</span></div>'
            : "";

  const hint = run.showHint
    ? '<p class="construct-hint-copy">' + esc(currentHint) + '</p>'
    : "";

  let toolbar;
  if (run.finished) {
    toolbar = '<aside class="construct-toolbox construct-toolbox-done"><button type="button" class="button button-lime construct-primary" data-action="prototype-restart">' +
      esc(label("Experimentar outra vez", "Try again")) + ' ↻</button></aside>';
  } else {
    const activeCategory = ["numbers", "structures"].includes(run.category) ? run.category : "symbols";
    const activeTokens = activeCategory === "numbers" ? numberTokens : activeCategory === "structures" ? structureTokens : symbolTokens;
    toolbar = '<aside class="construct-toolbox">' +
      '<div class="construct-tool-tabs" role="tablist" aria-label="' + esc(label("Ferramentas", "Tools")) + '">' +
      '<button type="button" role="tab" aria-selected="' + (activeCategory === "symbols") + '" class="' + (activeCategory === "symbols" ? "is-active" : "") + '" data-action="prototype-category" data-category="symbols"' + (!interactive ? " disabled" : "") + '>' + esc(label("Símbolos", "Symbols")) + '</button>' +
      '<button type="button" role="tab" aria-selected="' + (activeCategory === "numbers") + '" class="' + (activeCategory === "numbers" ? "is-active" : "") + '" data-action="prototype-category" data-category="numbers"' + (!interactive ? " disabled" : "") + '>' + esc(label("Números", "Numbers")) + '</button>' +
      '<button type="button" role="tab" aria-selected="' + (activeCategory === "structures") + '" class="' + (activeCategory === "structures" ? "is-active" : "") + '" data-action="prototype-category" data-category="structures"' + (!interactive ? " disabled" : "") + '>' + esc(label("Fracções", "Fractions")) + '</button></div>' +
      '<div class="construct-token-bank is-' + activeCategory + '">' + activeTokens + '</div>' +
      '<div class="construct-tool-actions ' + (Number.isInteger(run.selectedTokenIndex) ? 'has-selection' : '') + '">' +
      '<button type="button" data-action="prototype-undo" ' + (getPrototypeTargetTokens(run).length ? "" : "disabled") + '>' + esc(label("↶ Desfazer", "↶ Undo")) + '</button>' +
      (Number.isInteger(run.selectedTokenIndex) ? '<button type="button" data-action="prototype-delete-selected">' + esc(label("Apagar seleccionado", "Delete selected")) + '</button>' : '') +
      '<button type="button" data-action="prototype-clear" ' + (run.builtTokens.length ? "" : "disabled") + '>' + esc(label("Limpar linha", "Clear line")) + '</button></div>' +
      '<div class="construct-hint"><button type="button" data-action="prototype-hint">' + esc(label(run.showHint ? "Ocultar dica" : "Dica", run.showHint ? "Hide hint" : "Hint")) + ' <span aria-hidden="true">ⓘ</span></button>' +
      hint + '</div></aside>';
  }

  let actionMarkup = "";
  if (run.finished) {
    actionMarkup = '<div class="construct-finished" role="status">' +
      '<strong>' + esc(run.gaveUp
        ? label("Solução revelada. Estuda os passos e tenta refazê-los.", "Solution revealed. Study the steps, then try them yourself.")
        : run.levelId
          ? label("Resposta aceite. Nível " + String(run.levelId).padStart(2, "0") + " concluído.", "Answer accepted. Level " + String(run.levelId).padStart(2, "0") + " complete.")
          : label("Resolução concluída.", "Solution complete.")) + '</strong>' +
      (run.levelId ? '<button type="button" class="button button-ghost" data-action="prototype-back">' + esc(label("Voltar aos níveis", "Back to levels")) + '</button>' : '') +
      '</div>';
  } else if (run.checked && run.editingLineIndex !== null) {
    actionMarkup = '<div class="construct-actions"><button type="button" class="button button-ghost" data-action="prototype-save-edit">' +
      esc(label("Guardar alteração", "Save change")) + '</button>' +
      (finalAnswer ? '<button type="button" class="button button-lime construct-primary" data-action="prototype-finish">' + esc(label("Concluir", "Finish")) + ' →</button>' : "") +
      '<button type="button" class="button button-ghost" data-action="prototype-cancel-edit">' + esc(label("Cancelar", "Cancel")) + '</button></div>';
  } else if (run.checked) {
    actionMarkup = '<div class="construct-actions">' +
      (finalAnswer ? '<button type="button" class="button button-lime construct-primary" data-action="prototype-finish">' + esc(label("Concluir", "Finish")) + ' →</button>' : "") +
      '<button type="button" class="button ' + (finalAnswer ? "button-ghost" : "button-lime construct-primary") + '" data-action="prototype-continue">' +
      esc(label(finalAnswer ? "Adicionar passo" : "Continuar", finalAnswer ? "Add another line" : "Continue")) + (finalAnswer ? "" : " →") + '</button></div>';
  } else if (run.editingLineIndex !== null) {
    actionMarkup = '<div class="construct-actions"><button type="button" class="button button-lime construct-primary" data-action="prototype-check" ' +
      (!run.builtTokens.length ? "disabled" : "") + '>' + esc(label("Verificar", "Check")) + ' →</button>' +
      '<button type="button" class="button button-ghost" data-action="prototype-cancel-edit">' + esc(label("Cancelar", "Cancel")) + '</button></div>';
  } else {
    actionMarkup = '<div class="construct-actions"><button type="button" class="button button-lime construct-primary" data-action="prototype-check" ' +
      (!run.builtTokens.length ? "disabled" : "") + '>' + esc(label("Verificar", "Check")) + ' →</button></div>';
  }

  if (!run.finished && [1, 2].includes(run.levelId)) {
    actionMarkup += '<div class="construct-actions construct-give-up-actions"><button type="button" class="button button-ghost" data-action="prototype-give-up">' +
      esc(label("Desistir e ver solução", "Give up and reveal solution")) + '</button></div>';
  }

  return '<section class="page tools-page level-play-page construct-prototype-page">' +
    '<div class="construct-topbar"><button type="button" class="text-link level-back-link" data-action="prototype-back">← ' +
    esc(label("Níveis", "Levels")) + '</button></div>' +
    '<div class="construct-workspace"><section class="construct-board" aria-label="' +
    esc(label("Quadro de resolução matemática", "Mathematical working board")) + '">' +
      '<div class="construct-board-header"><span class="construct-board-title">' +
      esc(label("Simplifique", "Simplify")) + '</span><span class="construct-board-prompt">' +
      esc(run.restrictionLabel || "x ≠ 3") + '</span></div>' +
      '<div class="construct-steps">' +
      renderRow("1", sourceTokens, "is-source", { source: true }) +
      completedRows + activeRow +
      '</div></section>' + toolbar + '</div>' +
    (feedback ? '<div class="construct-feedback-wrap">' + feedback + '</div>' : "") +
    actionMarkup +
    '</section>';
}
