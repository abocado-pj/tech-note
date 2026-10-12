import { useId } from "react";

export type PaperSubject = "layers" | "note" | "code" | "style" | "html" | "database" | "leaf";

export function paperSubject(source = ""): PaperSubject {
  if (/css/.test(source)) return "style";
  if (/json|javascript|typescript/.test(source)) return "code";
  if (/html/.test(source)) return "html";
  if (/svg/.test(source)) return "leaf";
  if (/database|sql/.test(source)) return "database";
  if (/markdown|mdx/.test(source)) return "note";
  return "layers";
}

/** Decorative vector artwork; article titles and facts remain in real text. */
export function PaperScene({ subject = "layers", className = "" }: { subject?: PaperSubject; className?: string }) {
  const id = useId().replaceAll(":", "");
  return (
    <svg className={`paper-scene ${className}`} viewBox="0 0 440 280" fill="none" aria-hidden focusable="false">
      <defs>
        <linearGradient id={`${id}-paper`} x1="70" y1="45" x2="370" y2="260" gradientUnits="userSpaceOnUse"><stop stopColor="#fffef9" /><stop offset="1" stopColor="#e5e0d4" /></linearGradient>
        <linearGradient id={`${id}-sage`} x1="160" y1="20" x2="290" y2="250" gradientUnits="userSpaceOnUse"><stop stopColor="#bdd0c2" /><stop offset="1" stopColor="#6f9984" /></linearGradient>
        <filter id={`${id}-shadow`} x="-30%" y="-25%" width="160%" height="180%"><feDropShadow dx="3" dy="9" stdDeviation="7" floodColor="#28453b" floodOpacity=".15" /></filter>
        <pattern id={`${id}-grain`} width="9" height="11" patternUnits="userSpaceOnUse"><path d="M1 2l2 1M7 6l-2 2M2 9h1" stroke="#786f60" strokeOpacity=".065" strokeWidth=".6" /></pattern>
      </defs>
      <ellipse cx="238" cy="248" rx="151" ry="15" fill="#244a3b" opacity=".045" />
      <g filter={`url(#${id}-shadow)`}>
        {subject === "style" ? <>
          <path d="M105 70L327 102L352 235L100 228Z" fill={`url(#${id}-sage)`} /><path d="M82 98L284 128Q320 158 351 235L86 223Z" fill={`url(#${id}-paper)`} /><path d="M65 131L245 155Q299 168 351 235L70 222Z" fill={`url(#${id}-sage)`} /><path d="M57 154L222 169Q287 184 351 235L63 222Z" fill={`url(#${id}-paper)`} /><path d="M222 169Q287 184 351 235" stroke="#557d68" strokeWidth="2" />
        </> : subject === "code" ? <>
          <path d="M166 79L266 92V225L166 211Z" fill={`url(#${id}-sage)`} /><path d="M216 127L286 135V237L216 227Z" fill={`url(#${id}-paper)`} /><path d="M148 59C100 54 111 109 96 131C90 139 77 143 65 146C78 150 92 152 96 164C110 187 101 238 148 241M294 59C340 54 331 109 344 131C350 139 363 143 375 146C362 150 348 152 344 164C331 187 339 238 294 241" stroke="#e6e1d4" strokeWidth="16" strokeLinecap="round" />
        </> : subject === "database" ? <>
          <path d="M112 54L253 88V234L112 201Z" fill={`url(#${id}-sage)`} /><path d="M80 91L202 116V243L80 219Z" fill={`url(#${id}-paper)`} /><path d="M238 130V220C238 242 338 242 338 220V130" fill={`url(#${id}-paper)`} /><ellipse cx="288" cy="130" rx="50" ry="15" fill="#fcfaf3" /><path d="M238 158C238 180 338 180 338 158M238 189C238 211 338 211 338 189" stroke="#8a9b8b" strokeWidth="2" />
        </> : subject === "layers" ? <>
          <path d="M175 31L317 63V206L175 174Z" fill={`url(#${id}-sage)`} /><path d="M237 61L363 87V229L237 203Z" fill={`url(#${id}-paper)`} /><path d="M110 76L275 115V236L110 197Z" fill={`url(#${id}-paper)`} /><path d="M149 118L283 144V245L149 219Z" fill={`url(#${id}-sage)`} /><path d="M75 129L240 166V253L75 216Z" fill={`url(#${id}-paper)`} /><path d="M75 216Q145 253 240 253L185 265Q125 263 75 240Z" fill="#fbf9f0" />
        </> : <>
          {subject !== "note" ? <path d="M184 48L326 74V225L184 201Z" fill={`url(#${id}-sage)`} /> : null}<path d="M112 69L272 96V239L112 212Z" fill={`url(#${id}-paper)`} />
          {subject === "leaf" ? <g stroke="#426c5b" strokeWidth="3"><path d="M149 189Q141 115 238 116Q242 186 149 189Z" fill="#adc5b0" /><path d="M145 194L225 130M180 163L176 136M198 149L223 152" /></g> : <g fill="#82a18b"><path d="M142 121L241 138V148L142 131ZM142 153L241 170V180L142 163ZM142 184L216 197V207L142 194Z" /></g>}
        </>}
      </g>
      <path d="M60 42H382V265H60Z" fill={`url(#${id}-grain)`} opacity=".65" />
    </svg>
  );
}
