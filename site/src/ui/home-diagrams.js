export function homeSubjectDiagram(id) {
  if (id === 'math') return `<svg viewBox="0 0 420 180" role="img" aria-label="Mathematics: number patterns">
    <g fill="none" stroke="#b6c0cc" stroke-width="1.5"><path d="M20 161H398"/><path d="M28 22V161" stroke-dasharray="3 7" opacity=".5"/></g>
    <g font-family="Plus Jakarta Sans,sans-serif" font-weight="800" text-anchor="middle">
      <rect x="30" y="111" width="62" height="50" rx="12" fill="#e6f7ce"/><text x="61" y="143" fill="#416f32" font-size="24">2</text>
      <rect x="126" y="91" width="62" height="70" rx="12" fill="#e7edff"/><text x="157" y="133" fill="#4167c2" font-size="24">4</text>
      <rect x="222" y="71" width="62" height="90" rx="12" fill="#ffebe6"/><text x="253" y="123" fill="#c95443" font-size="24">6</text>
      <rect x="318" y="51" width="62" height="110" rx="12" fill="#fff1c1"/><text x="349" y="113" fill="#8a6c16" font-size="24">8</text>
    </g>
    <g fill="none" stroke="#6d86d8" stroke-width="2.4" stroke-linecap="round"><path d="M87 105 Q103 77 124 86"/><path d="M183 85 Q199 57 220 66"/><path d="M279 65 Q295 37 316 46"/></g>
    <g fill="#647bd1" font-family="DM Mono,monospace" font-size="13" font-weight="800" text-anchor="middle"><text x="109" y="64">+2</text><text x="205" y="44">+2</text><text x="301" y="24">+2</text></g>
  </svg>`;
  if (id === 'physics') return `<svg viewBox="0 0 420 180" role="img" aria-label="Physics: vector components">
    <defs><marker id="home-physics-arrow-wide" markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto"><path d="M0 0 7 3.5 0 7Z" fill="context-stroke"/></marker></defs>
    <g fill="none" stroke="#aab6c4" stroke-width="1.6"><path d="M42 154H390" marker-end="url(#home-physics-arrow-wide)"/><path d="M42 154V15" marker-end="url(#home-physics-arrow-wide)"/></g>
    <path d="M73 140 302 39" fill="none" stroke="#6c87dc" stroke-width="3.2" stroke-linecap="round" stroke-dasharray="6 8"/>
    <path d="M73 140H302" fill="none" stroke="#df796c" stroke-width="4.5" stroke-linecap="round" marker-end="url(#home-physics-arrow-wide)"/>
    <path d="M302 140V39" fill="none" stroke="#4d9b8e" stroke-width="4.5" stroke-linecap="round" marker-end="url(#home-physics-arrow-wide)"/>
    <circle cx="73" cy="140" r="6" fill="#f5c95c" stroke="#26364a" stroke-width="1.5"/><circle cx="302" cy="140" r="5.5" fill="#df796c" stroke="#fffdf8" stroke-width="2"/><circle cx="302" cy="39" r="6" fill="#6c87dc" stroke="#fffdf8" stroke-width="2"/>
    <g font-family="DM Mono,Cambria Math,Noto Sans Math,monospace" font-weight="800" font-size="16"><text x="172" y="128" fill="#bd5e52">vₓ</text><text x="318" y="93" fill="#398e83">vᵧ</text><text x="157" y="69" fill="#647bd1">v⃗</text></g>
  </svg>`;
  if (id === 'algebra') return `<svg viewBox="0 0 420 180" role="img" aria-label="Algebra: Cartesian coordinates and a point">
    <g stroke="#cbd4d2" stroke-width="1.2" stroke-dasharray="2 7" opacity=".9"><path d="M65 33H357M65 63H357M65 93H357M65 123H357M95 20V155M135 20V155M175 20V155M215 20V155M255 20V155M295 20V155M335 20V155"/></g>
    <g fill="none" stroke="#66788e" stroke-width="1.8" stroke-linecap="round"><path d="M47 125H384"/><path d="M175 165V12"/><path d="m377 119 7 6-7 6M169 20l6-8 6 8"/></g>
    <path d="M295 125V63H175" fill="none" stroke="#5b87f6" stroke-width="2.5" stroke-dasharray="5 6"/>
    <circle cx="295" cy="63" r="7" fill="#b8f36b" stroke="#426c37" stroke-width="2"/>
    <g fill="#416f32" font-family="DM Mono,monospace" font-weight="800"><text x="307" y="49" font-size="17">P(3, 2)</text><text x="299" y="146" font-size="13">3</text><text x="151" y="58" font-size="13">2</text></g>
    <g fill="#647bd1" font-family="DM Mono,monospace" font-size="15" font-weight="800"><text x="387" y="113">x</text><text x="187" y="17">y</text></g>
  </svg>`;
  return `<svg viewBox="0 0 420 180" role="img" aria-label="Chemistry: molecule model">
    <g fill="none" stroke-linecap="round"><path d="M176 86 129 121M244 86 291 121" stroke="#8ab7b0" stroke-width="8"/><path d="M176 86 129 121M244 86 291 121" stroke="#fffdf8" stroke-width="2" stroke-dasharray="3 8"/></g>
    <circle cx="210" cy="70" r="43" fill="#ffebe6" stroke="#df796c" stroke-width="2.5"/><circle cx="112" cy="134" r="27" fill="#e7edff" stroke="#6c87dc" stroke-width="2"/><circle cx="308" cy="134" r="27" fill="#e7edff" stroke="#6c87dc" stroke-width="2"/>
    <g font-family="Plus Jakarta Sans,sans-serif" font-weight="800" text-anchor="middle"><text x="210" y="78" fill="#bd5e52" font-size="25">O</text><text x="112" y="141" fill="#4167c2" font-size="20">H</text><text x="308" y="141" fill="#4167c2" font-size="20">H</text></g>
    <g fill="#93a3b5"><circle cx="154" cy="44" r="3"/><circle cx="268" cy="40" r="3"/><circle cx="340" cy="66" r="3"/><circle cx="78" cy="55" r="3"/><circle cx="365" cy="106" r="3"/></g>
    <path d="M154 44Q210 3 268 40" fill="none" stroke="#c7d3d0" stroke-width="1.5" stroke-dasharray="3 7"/>
  </svg>`;
}
