/* Reusable, bounded symbolic engine for rational expressions in one variable x.
 * It parses the expression tree, compares equivalent rational forms, and preserves
 * a question-supplied excluded value. The assessment layer supplies its own target.
 */
function trimPoly(poly) {
  const result = (poly || [0]).map(value => Math.abs(value) < 1e-9 ? 0 : Number(value.toFixed(8)));
  while (result.length > 1 && result[result.length - 1] === 0) result.pop();
  return result.length ? result : [0];
}

function addPoly(a, b) {
  const result = Array(Math.max(a.length, b.length)).fill(0);
  for (let i = 0; i < result.length; i++) result[i] = (a[i] || 0) + (b[i] || 0);
  return trimPoly(result);
}

function subtractPoly(a, b) {
  const result = Array(Math.max(a.length, b.length)).fill(0);
  for (let i = 0; i < result.length; i++) result[i] = (a[i] || 0) - (b[i] || 0);
  return trimPoly(result);
}

function multiplyPoly(a, b) {
  if (a.length + b.length - 2 > 12) return null;
  const result = Array(a.length + b.length - 1).fill(0);
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) result[i + j] += a[i] * b[j];
  }
  return trimPoly(result);
}

function zeroPoly(poly) {
  return trimPoly(poly).every(value => Math.abs(value) < 1e-8);
}

function samePoly(a, b) {
  if (!a || !b) return false;
  const left = trimPoly(a);
  const right = trimPoly(b);
  return left.length === right.length && left.every((value, index) => Math.abs(value - right[index]) < 1e-7);
}

function rational(numerator, denominator = [1]) {
  const num = trimPoly(numerator);
  const den = trimPoly(denominator);
  if (zeroPoly(den)) return null;
  return { numerator: num, denominator: den };
}

function addRational(a, b, sign = 1) {
  const left = multiplyPoly(a.numerator, b.denominator);
  const right = multiplyPoly(b.numerator, a.denominator);
  const denominator = multiplyPoly(a.denominator, b.denominator);
  if (!left || !right || !denominator) return null;
  return rational(sign === 1 ? addPoly(left, right) : subtractPoly(left, right), denominator);
}

function multiplyRational(a, b) {
  const numerator = multiplyPoly(a.numerator, b.numerator);
  const denominator = multiplyPoly(a.denominator, b.denominator);
  return numerator && denominator ? rational(numerator, denominator) : null;
}

function divideRational(a, b) {
  if (zeroPoly(b.numerator)) return null;
  const numerator = multiplyPoly(a.numerator, b.denominator);
  const denominator = multiplyPoly(a.denominator, b.numerator);
  return numerator && denominator ? rational(numerator, denominator) : null;
}

function negateRational(a) {
  return rational(a.numerator.map(value => -value), a.denominator);
}

function squareRational(a) {
  const numerator = multiplyPoly(a.numerator, a.numerator);
  const denominator = multiplyPoly(a.denominator, a.denominator);
  return numerator && denominator ? rational(numerator, denominator) : null;
}

function toRational(ast) {
  if (!ast) return null;
  if (ast.type === "number") return rational([ast.value]);
  if (ast.type === "x") return rational([0, 1]);
  if (ast.type === "neg") {
    const value = toRational(ast.value);
    return value ? negateRational(value) : null;
  }
  if (ast.type === "square") {
    const value = toRational(ast.value);
    return value ? squareRational(value) : null;
  }
  const left = toRational(ast.left);
  const right = toRational(ast.right);
  if (!left || !right) return null;
  if (ast.type === "add") return addRational(left, right, 1);
  if (ast.type === "subtract") return addRational(left, right, -1);
  if (ast.type === "multiply") return multiplyRational(left, right);
  if (ast.type === "divide") return divideRational(left, right);
  return null;
}

function digitValue(token) {
  if (/^n[0-9]$/.test(token)) return token.slice(1);
  if (/^[0-9]$/.test(token)) return token;
  if (token === "three") return "3";
  if (token === "nine") return "9";
  return null;
}

function parseTokens(tokens) {
  const raw = [];
  for (const token of tokens || []) {
    if (token && typeof token === "object" && token.type === "fraction") {
      const numerator = parseTokens(token.numerator);
      const denominator = parseTokens(token.denominator);
      if (!numerator || !denominator) return null;
      raw.push({ type: "atom", ast: { type: "divide", left: numerator, right: denominator } });
      continue;
    }
    const id = String(token);
    const digit = digitValue(id);
    if (digit !== null) {
      raw.push({ type: "digit", value: digit });
    } else if (id === "x") {
      raw.push({ type: "atom", ast: { type: "x" } });
    } else if (id === "x2") {
      raw.push({ type: "atom", ast: { type: "square", value: { type: "x" } } });
    } else if (id === "plus") {
      raw.push({ type: "operator", op: "add" });
    } else if (id === "minus") {
      raw.push({ type: "operator", op: "subtract" });
    } else if (id === "times") {
      raw.push({ type: "operator", op: "multiply" });
    } else if (id === "divide") {
      raw.push({ type: "operator", op: "divide" });
    } else if (id === "open") {
      raw.push({ type: "open" });
    } else if (id === "close") {
      raw.push({ type: "close" });
    } else {
      return null;
    }
  }

  const combined = [];
  for (let i = 0; i < raw.length; i++) {
    if (raw[i].type !== "digit") {
      combined.push(raw[i]);
      continue;
    }
    let digits = raw[i].value;
    while (i + 1 < raw.length && raw[i + 1].type === "digit") digits += raw[++i].value;
    combined.push({ type: "number", value: Number(digits) });
  }

  let index = 0;
  const startsFactor = token => token && ["number", "atom", "open"].includes(token.type);

  function primary() {
    const token = combined[index];
    if (!token) return null;
    if (token.type === "number") {
      index++;
      return { type: "number", value: token.value };
    }
    if (token.type === "atom") {
      index++;
      return token.ast;
    }
    if (token.type === "open") {
      index++;
      const inside = addition();
      if (!inside || combined[index]?.type !== "close") return null;
      index++;
      return inside;
    }
    return null;
  }

  function unary() {
    const token = combined[index];
    if (token?.type === "operator" && token.op === "subtract") {
      index++;
      const value = unary();
      return value ? { type: "neg", value } : null;
    }
    if (token?.type === "operator" && token.op === "add") {
      index++;
      return unary();
    }
    return primary();
  }

  function multiplication() {
    let left = unary();
    if (!left) return null;
    while (index < combined.length) {
      const token = combined[index];
      if (token.type === "operator" && ["multiply", "divide"].includes(token.op)) {
        index++;
        const right = unary();
        if (!right) return null;
        left = { type: token.op, left, right };
      } else if (startsFactor(token)) {
        const right = unary();
        if (!right) return null;
        left = { type: "multiply", left, right };
      } else {
        break;
      }
    }
    return left;
  }

  function addition() {
    let left = multiplication();
    if (!left) return null;
    while (index < combined.length) {
      const token = combined[index];
      if (token.type !== "operator" || !["add", "subtract"].includes(token.op)) break;
      index++;
      const right = multiplication();
      if (!right) return null;
      left = { type: token.op === "add" ? "add" : "subtract", left, right };
    }
    return left;
  }

  const ast = addition();
  return ast && index === combined.length ? ast : null;
}

function sameRational(a, b) {
  if (!a || !b) return false;
  const left = multiplyPoly(a.numerator, b.denominator);
  const right = multiplyPoly(b.numerator, a.denominator);
  return !!left && !!right && samePoly(left, right);
}

function divideByRestrictedRoot(poly, root = 3) {
  const p = trimPoly(poly);
  if (p.length <= 1) return null;
  let remainder = 0;
  const quotient = Array(p.length - 1).fill(0);
  quotient[quotient.length - 1] = p[p.length - 1];
  for (let i = quotient.length - 2; i >= 0; i--) quotient[i] = p[i + 1] + root * quotient[i + 1];
  remainder = p[0] + root * quotient[0];
  return Math.abs(remainder) < 1e-7 ? trimPoly(quotient) : null;
}

function denominatorRespectsRestriction(poly, restrictedRoot = 3) {
  let remainder = trimPoly(poly);
  if (zeroPoly(remainder)) return false;
  while (remainder.length > 1) {
    const quotient = divideByRestrictedRoot(remainder, restrictedRoot);
    if (!quotient) return false;
    remainder = quotient;
  }
  return Math.abs(remainder[0]) > 1e-8;
}

function splitSides(tokens) {
  const indices = [];
  (tokens || []).forEach((token, index) => {
    if (token === "equals") indices.push(index);
  });
  if (indices.length > 1) return null;
  if (!indices.length) return [tokens];
  const index = indices[0];
  if (index === 0 || index === tokens.length - 1) return null;
  return [tokens.slice(0, index), tokens.slice(index + 1)];
}

function lineSideRationals(tokens, restrictedRoot = 3) {
  const sides = splitSides(tokens);
  if (!sides || sides.some(side => !side.length)) return { status: "invalid" };
  const values = sides.map(side => {
    const ast = parseTokens(side);
    return ast ? toRational(ast) : null;
  });
  if (values.some(value => !value)) return { status: "invalid" };
  if (values.some(value => !denominatorRespectsRestriction(value.denominator, restrictedRoot))) return { status: "restriction" };
  return { status: "parsed", values };
}

export function validateEquivalentLine(tokens, sourceExpression, restrictedRoot = 3) {
  const parsed = lineSideRationals(tokens || [], restrictedRoot);
  if (parsed.status !== "parsed") return parsed.status;
  const originalAst = parseTokens(sourceExpression || []);
  const original = originalAst ? toRational(originalAst) : null;
  if (!original) return "invalid";
  return parsed.values.every(side => sameRational(side, original)) ? "correct" : "equivalence";
}

function containsFractionSyntax(tokens) {
  return (tokens || []).some(token => {
    if (token && typeof token === "object" && token.type === "fraction") return true;
    return token === "divide";
  });
}

export function matchesSimplifiedExpression(tokens, targetTokens) {
  const sides = splitSides(tokens || []);
  if (!sides || sides.some(side => !side.length)) return false;
  const targetAst = parseTokens(targetTokens || []);
  const target = targetAst ? toRational(targetAst) : null;
  if (!target || target.denominator.length !== 1 || Math.abs(target.denominator[0] - 1) > 1e-8) return false;
  return sides.some(side => {
    if (containsFractionSyntax(side)) return false;
    const ast = parseTokens(side);
    const value = ast ? toRational(ast) : null;
    return !!value &&
      value.denominator.length === 1 &&
      Math.abs(value.denominator[0] - 1) <= 1e-8 &&
      sameRational(value, target);
  });
}
