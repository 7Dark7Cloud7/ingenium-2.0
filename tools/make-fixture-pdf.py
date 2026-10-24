import base64, os, textwrap, zlib

paragraphs = [
    "Ficha de Fisica - Cinematica",
    "A velocidade media de um corpo e o quociente entre o deslocamento e o intervalo de tempo em que esse movimento ocorre.",
    "Um automovel percorre 300 km em 4 horas. A velocidade media e de 75 km/h.",
    "A aceleracao mede a variacao da velocidade por unidade de tempo e expressa-se em metros por segundo ao quadrado.",
    "Numa queda livre, desprezando a resistencia do ar, todos os corpos caem com a mesma aceleracao de cerca de 9,8 metros por segundo ao quadrado.",
    "Um helicoptero de levantamento agricola sobrevoa um campo e largou uma amostra a 20 metros de altura. A trajectoria e uma parabola.",
    "Conclusao: conhecer as formulas do movimento permite prever posicao, tempo e velocidade de qualquer corpo em trajecto rectilineo.",
]

lines = []
for para in paragraphs:
    chunk = textwrap.wrap(para, width=76) or [""]
    lines.extend(chunk if len(chunk) > 1 else [para])

parts = []
y = 760
for ln in lines:
    esc = ln.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")
    parts.append("BT /F1 11 Tf 1 0 0 1 50 %d Tm (%s) Tj ET" % (y, esc))
    y -= 16
content = "".join(parts).encode("latin-1")
comp = zlib.compress(content)

objs = [
    b"<< /Type /Catalog /Pages 2 0 R >>",
    b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
    b"<< /Length " + str(len(comp)).encode() + b" /Filter /FlateDecode >>\nstream\n" + comp + b"\nendstream",
]

pdf = bytearray(b"%PDF-1.4\n")
offsets = []
for i, body in enumerate(objs, start=1):
    offsets.append(len(pdf))
    pdf += str(i).encode() + b" 0 obj\n" + body + b"\nendobj\n"
xref = len(pdf)
pdf += b"xref\n0 " + str(len(objs) + 1).encode() + b"\n0000000000 65535 f \n"
for off in offsets:
    pdf += ("%010d 00000 n \n" % off).encode()
pdf += b"trailer\n<< /Size " + str(len(objs) + 1).encode() + b" /Root 1 0 R >>\nstartxref\n" + str(xref).encode() + b"\n%%EOF\n"

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out = os.path.join(root, "fixtures", "ficha-fisica.pdf")
os.makedirs(os.path.dirname(out), exist_ok=True)
with open(out, "wb") as fh:
    fh.write(bytes(pdf))
with open(os.path.join(root, "fixtures", "ficha-fisica.b64"), "w") as fh:
    fh.write(base64.b64encode(bytes(pdf)).decode())
print(out, len(pdf))
