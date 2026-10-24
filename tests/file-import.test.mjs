import test from "node:test";
import assert from "node:assert/strict";
import {
  IMPORT_LIMITS,
  ImportError,
  importErrorMessage,
  formatFileSize,
  fileKind,
  validateImportFile,
  filenameToTitle,
  inferImportTitle,
  cleanExtractedText,
  pdfItemsToText,
  suggestSubject,
  sourceLabel,
  sha256Hex,
} from "../site/src/study/file-import.js";

const pdf = (overrides = {}) => ({ name: "aula.pdf", type: "application/pdf", size: 2048, ...overrides });

test("formatFileSize uses readable units", () => {
  assert.equal(formatFileSize(512), "512 B");
  assert.equal(formatFileSize(2048), "2 KB");
  assert.equal(formatFileSize(1.5 * 1024 * 1024), "1.5 MB");
  assert.equal(formatFileSize(15 * 1024 * 1024), "15 MB");
  assert.equal(formatFileSize(-1), "");
  assert.equal(formatFileSize(Number.NaN), "");
});

test("fileKind prefers MIME type but accepts a clear extension", () => {
  assert.equal(fileKind({ name: "scan", type: "application/pdf" }), "pdf");
  assert.equal(fileKind({ name: "FOTO.JPG", type: "" }), "image");
  assert.equal(fileKind({ name: "notas.webp", type: "image/webp; charset=binary" }), "image");
  assert.equal(fileKind({ name: "programa.docx", type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }), null);
});

test("validateImportFile rejects empty, oversized and unsupported files", () => {
  assert.deepEqual(validateImportFile(pdf()), { ok: true, kind: "pdf" });
  assert.equal(validateImportFile(pdf({ size: 0 })).code, "empty");
  assert.equal(validateImportFile(pdf({ size: IMPORT_LIMITS.maxBytes + 1 })).code, "size");
  assert.match(validateImportFile(pdf({ size: IMPORT_LIMITS.maxBytes + 1 })).detail, /^20\.0$/);
  assert.equal(validateImportFile({ name: "notas.docx", type: "application/msword", size: 12 }).code, "type");
  assert.equal(validateImportFile(null).code, "unknown");
});

test("filenameToTitle turns file names into human titles", () => {
  assert.equal(filenameToTitle("2026-03-12_Cinematica___aula+3.pdf"), "Cinematica aula 3");
  assert.equal(filenameToTitle("resumo.PDF"), "Resumo");
  assert.equal(filenameToTitle(""), "");
});

test("inferImportTitle prefers clean metadata, then the filename, then the first line", () => {
  assert.equal(inferImportTitle({ filename: "scan001.pdf", metaTitle: "Lei de Ohm", text: "" }), "Lei de Ohm");
  assert.equal(inferImportTitle({ filename: "Aula_5_Atrito.pdf", metaTitle: "Untitled", text: "" }), "Aula 5 Atrito");
  assert.equal(inferImportTitle({ filename: "IMG_2026.jpg", text: "\nSegunda lei de Newton\nO corpo acelera." }), "Segunda lei de Newton");
  assert.equal(inferImportTitle({ filename: "IMG_2026.jpg", lang: "en", text: "" }), "Imported document");
});

test("cleanExtractedText rejoins hyphenated words, drops page numbers and keeps paragraphs", () => {
  const input = "A acelera-\nção média é constante.\n\n7\n\n• primeiro ponto\n• segundo ponto\n\nRESUMO\nA queda livre tem 9,8 m/s².";
  const clean = cleanExtractedText(input);
  assert.match(clean, /aceleração média/);
  assert.doesNotMatch(clean, /^7$/m);
  assert.match(clean, /• primeiro ponto/);
  assert.match(clean, /RESUMO/);
  assert.match(clean, /A queda livre/);
  assert.ok(clean.split(/\n{2,}/).length >= 3);
});

test("a line break after a real hyphen keeps the hyphen instead of welding words", () => {
  assert.equal(cleanExtractedText("A grandeza expressa-\nse em metros."), "A grandeza expressa-se em metros.");
  assert.equal(cleanExtractedText("Isto chama-\nse inércia."), "Isto chama-se inércia.");
  assert.equal(cleanExtractedText("Um material anti-\ninflamatório."), "Um material antiinflamatório.");
  assert.equal(cleanExtractedText("A ace-\nleração é média."), "A aceleração é média.");
});

test("cleanExtractedText strips zero-width characters and extra blank lines", () => {  assert.equal(cleanExtractedText("A\u200bB\u00a0C\n\n\n\nD"), "AB C\n\nD");
  assert.equal(cleanExtractedText(""), "");
});

test("pdfItemsToText rebuilds spaces and line breaks", () => {
  const text = pdfItemsToText([
    { str: "A", hasEOL: false },
    { str: "força", hasEOL: false },
    { str: "", hasEOL: true },
    { str: "resulta", hasEOL: false },
    { str: "em movimento", hasEOL: false },
  ]);
  assert.equal(text, "A força\nresulta em movimento");
});

test("suggestSubject matches whole words so accidental substrings are ignored", () => {
  assert.equal(suggestSubject("A matriz identidade e o determinante de uma transformação linear."), "algebra");
  assert.equal(suggestSubject("A velocidade e a aceleração de um projétil."), "physics");
  assert.equal(suggestSubject("O átomo e a ligação química formam a molécula."), "chemistry");
  assert.equal(suggestSubject("A derivada e a integral de uma função."), "math");
  assert.equal(suggestSubject("A base de dados guarda os registos do projeto."), "general");
  assert.equal(suggestSubject("The database stores graphs and photographs."), "general");
});

test("sourceLabel explains how the text was obtained", () => {
  assert.match(sourceLabel("pdf-text", "pt"), /PDF com texto/);
  assert.match(sourceLabel("mixed", "en"), /text \+ OCR/);
  assert.match(sourceLabel("image-ocr", "en"), /Image/);
  assert.equal(sourceLabel("unknown", "pt"), "Ficheiro importado");
});

test("importErrorMessage includes the real size when provided", () => {
  assert.match(importErrorMessage("size", "pt", "24.3"), /24\.3/);
  assert.equal(importErrorMessage("size", "en", "24.3").includes("24.3"), true);
  assert.match(importErrorMessage("no-text", "pt"), /texto legível/);
  assert.ok(new ImportError("pdf", new Error("x")) instanceof Error);
});

test("sha256Hex produces the SHA-256 of a buffer", async () => {
  const digest = await sha256Hex(new TextEncoder().encode("abc").buffer);
  assert.equal(digest, "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  assert.equal(await sha256Hex("abc"), digest);
});
