import { useState, useEffect, useCallback } from "react";

// ═══════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════
const C = {
  skyBlue:"#87CEEB", steelBlue:"#4682B4", lightGreen:"#90EE90", forestGreen:"#228B22", white:"#FFFFFF",
  skyBluePale:"#EAF6FD", skyBlueMid:"#C8E8F7", greenPale:"#E8F8E8", greenMid:"#B8E8B8", steelLight:"#D4E8F8",
  cream:"#FAFCFF", cloud:"#F0F7FF", fog:"#E0EDF8", slate:"#4A5E72", mist:"#8BA8C0",
  success:"#228B22", warning:"#D4860A", error:"#C0392B", info:"#4682B4",
  orange:"#FF6600", mtn:"#FFCC00",
};
const display = "'Playfair Display', Georgia, serif";
const body    = "'Lato', 'Helvetica Neue', sans-serif";

// ═══════════════════════════════════════════════════════
// MOTIFS SVG
// ═══════════════════════════════════════════════════════
const P = {
  leaves:`<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><g opacity='0.07' fill='${C.forestGreen}'><ellipse cx='30' cy='40' rx='18' ry='10' transform='rotate(-30 30 40)'/><line x1='30' y1='40' x2='42' y2='28' stroke='${C.forestGreen}' stroke-width='1.2'/><ellipse cx='90' cy='20' rx='14' ry='8' transform='rotate(20 90 20)'/><line x1='90' y1='20' x2='100' y2='10' stroke='${C.forestGreen}' stroke-width='1'/><ellipse cx='70' cy='85' rx='16' ry='9' transform='rotate(-15 70 85)'/><line x1='70' y1='85' x2='80' y2='75' stroke='${C.forestGreen}' stroke-width='1'/><ellipse cx='15' cy='95' rx='12' ry='7' transform='rotate(40 15 95)'/><ellipse cx='105' cy='70' rx='13' ry='7' transform='rotate(-25 105 70)'/></g></svg>`,
  snow:`<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><g opacity='0.08' stroke='${C.steelBlue}' stroke-width='1.2' fill='none'><g transform='translate(20,20)'><line x1='0' y1='-12' x2='0' y2='12'/><line x1='-12' y1='0' x2='12' y2='0'/><line x1='-8.5' y1='-8.5' x2='8.5' y2='8.5'/><line x1='8.5' y1='-8.5' x2='-8.5' y2='8.5'/><circle cx='0' cy='0' r='2' fill='${C.steelBlue}'/></g><g transform='translate(75,65)'><line x1='0' y1='-10' x2='0' y2='10'/><line x1='-10' y1='0' x2='10' y2='0'/><circle cx='0' cy='0' r='1.5' fill='${C.steelBlue}'/></g><g transform='translate(15,70)'><line x1='0' y1='-8' x2='0' y2='8'/><line x1='-8' y1='0' x2='8' y2='0'/><line x1='-5.5' y1='-5.5' x2='5.5' y2='5.5'/><circle cx='0' cy='0' r='1.5' fill='${C.steelBlue}'/></g></g></svg>`,
  garden:`<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><g opacity='0.06' fill='none' stroke='${C.forestGreen}' stroke-width='1.3'><g transform='translate(25,30) rotate(-20)'><ellipse cx='0' cy='-14' rx='5' ry='14' fill='${C.forestGreen}' opacity='0.5'/><ellipse cx='0' cy='14' rx='5' ry='14' fill='${C.forestGreen}' opacity='0.5'/><circle cx='0' cy='0' r='4' fill='white' stroke='${C.forestGreen}'/></g><g transform='translate(80,35)'><rect x='-18' y='-5' width='36' height='10' rx='3' fill='${C.forestGreen}' opacity='0.4'/><polygon points='-18,-5 -24,-2 -24,2 -18,5' fill='${C.forestGreen}' opacity='0.5'/><polygon points='18,-5 24,-2 24,2 18,5' fill='${C.forestGreen}' opacity='0.5'/></g><ellipse cx='55' cy='90' rx='10' ry='6' transform='rotate(-30 55 90)' fill='${C.lightGreen}' opacity='0.5'/></g></svg>`,
  clean:`<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><g opacity='0.065'><g transform='translate(25,40)' fill='${C.skyBlue}'><rect x='-6' y='-16' width='12' height='22' rx='4'/><rect x='2' y='-20' width='8' height='6' rx='2'/><rect x='6' y='-18' width='14' height='3' rx='1.5'/><circle cx='24' cy='-16' r='2'/><circle cx='28' cy='-12' r='1.5'/><circle cx='26' cy='-8' r='1.8'/></g><g transform='translate(62,65)' fill='${C.skyBlue}'><path d='M-16,-8 Q-8,-16 0,-10 Q8,-4 16,-8 Q20,0 16,8 Q8,16 0,12 Q-8,8 -16,8 Q-20,0 -16,-8Z'/></g></g></svg>`,
};
const bg = s => `url("data:image/svg+xml,${encodeURIComponent(s.trim())}")`;

// ═══════════════════════════════════════════════════════
// POLITIQUE DE CONFIDENTIALITÉ
// ═══════════════════════════════════════════════════════
const PRIVACY_FR = [
  { title:"1. Introduction", text:"La présente politique de confidentialité décrit la manière dont Limpidus collecte, utilise, stocke et protège les données personnelles de ses utilisateurs. En utilisant l'application, vous acceptez les pratiques décrites ci-dessous." },
  { title:"2. Données collectées", text:"Informations d'identification : nom, numéro de téléphone.\n\nInformations de paiement : numéro de téléphone lié à Orange Money ou MTN Mobile Money.\n\nDonnées techniques : type d'appareil, système d'exploitation, journaux de connexion." },
  { title:"3. Finalité de la collecte", text:"Les données sont utilisées exclusivement pour :\n\n• La réservation et la gestion des services.\n• Le traitement sécurisé des paiements digitaux.\n• L'amélioration de l'expérience utilisateur et la maintenance technique de l'application." },
  { title:"4. Partage des données", text:"Vos données ne sont jamais vendues ni partagées avec des tiers non autorisés. Elles peuvent être transmises uniquement :\n\n• Aux prestataires de paiement (Orange Money, MTN Mobile Money) pour exécuter les transactions.\n• Aux autorités compétentes si la loi l'exige." },
  { title:"5. Sécurité des données", text:"Nous appliquons des standards internationaux de sécurité (chiffrement, authentification forte, contrôle d'accès) afin de protéger vos informations contre toute perte, accès non autorisé ou divulgation." },
  { title:"6. Conservation des données", text:"Les données sont conservées uniquement le temps nécessaire à la fourniture des services et au respect des obligations légales. Elles sont ensuite supprimées ou anonymisées." },
  { title:"7. Droits des utilisateurs", text:"Conformément aux réglementations internationales (RGPD, standards ISO/IEC 27001) vous disposez de droits :\n\n• Accéder à vos données.\n• Demander leur rectification ou suppression.\n• Retirer votre consentement au traitement." },
  { title:"8. Paiements digitaux", text:"Toutes les transactions sont effectuées via Orange Money ou MTN Mobile Money. L'application ne stocke jamais vos identifiants financiers complets. Seul le numéro de téléphone lié au compte est utilisé pour initier le paiement." },
  { title:"9. Modifications de la politique", text:"Limpidus se réserve le droit de mettre à jour cette politique. Toute modification sera notifiée aux utilisateurs via l'application." },
  { title:"10. Contact", text:"Pour toute question relative à la confidentialité, vous pouvez nous contacter directement via l'application ou par email à : support@limpidus.cm" },
];

const PRIVACY_EN = [
  { title:"1. Introduction", text:"This privacy policy describes how Limpidus collects, uses, stores and protects the personal data of its users. By using the application, you agree to the practices described below." },
  { title:"2. Data Collected", text:"Identification information: name, phone number.\n\nPayment information: phone number linked to Orange Money or MTN Mobile Money.\n\nTechnical data: device type, operating system, connection logs." },
  { title:"3. Purpose of Collection", text:"Data is used exclusively for:\n\n• Booking and managing services.\n• Secure processing of digital payments.\n• Improving the user experience and technical maintenance of the application." },
  { title:"4. Data Sharing", text:"Your data is never sold or shared with unauthorized third parties. It may only be transmitted to:\n\n• Payment providers (Orange Money, MTN Mobile Money) to execute transactions.\n• Competent authorities if required by law." },
  { title:"5. Data Security", text:"We apply international security standards (encryption, strong authentication, access control) to protect your information against any loss, unauthorized access or disclosure." },
  { title:"6. Data Retention", text:"Data is retained only as long as necessary to provide services and comply with legal obligations. It is then deleted or anonymized." },
  { title:"7. User Rights", text:"In accordance with international regulations (GDPR, ISO/IEC 27001 standards) you have rights to:\n\n• Access your data.\n• Request its rectification or deletion.\n• Withdraw your consent to processing." },
  { title:"8. Digital Payments", text:"All transactions are made via Orange Money or MTN Mobile Money. The application never stores your complete financial identifiers. Only the phone number linked to the account is used to initiate payment." },
  { title:"9. Policy Updates", text:"Limpidus reserves the right to update this policy. Any changes will be notified to users via the application." },
  { title:"10. Contact", text:"For any questions regarding confidentiality, you can contact us directly via the application or by email at: support@limpidus.cm" },
];

// ═══════════════════════════════════════════════════════
// PUBLICITÉS
// ═══════════════════════════════════════════════════════
const ADS = [
  { id:1, bg:`linear-gradient(135deg,${C.forestGreen},#1a6e1a)`, text_fr:"🌿 Tonte du gazon dès 35 000 FCFA — Réservez maintenant", text_en:"🌿 Lawn mowing from 35,000 FCFA — Book now", cta_fr:"Réserver", cta_en:"Book" },
  { id:2, bg:`linear-gradient(135deg,${C.steelBlue},#2a5a9a)`,   text_fr:"❄️ Nettoyage climatiseur — Offre avril : -20%",            text_en:"❄️ AC Cleaning — April offer: -20%",                    cta_fr:"Profiter", cta_en:"Claim" },
  { id:3, bg:`linear-gradient(135deg,#E65C00,#F9D423)`,           text_fr:"💳 Payez facilement par Orange Money ou MTN MoMo",      text_en:"💳 Pay easily via Orange Money or MTN MoMo",            cta_fr:"En savoir plus", cta_en:"Learn more" },
];

// ═══════════════════════════════════════════════════════
// SERVICES MIS À JOUR (point 3)
// ═══════════════════════════════════════════════════════
const SERVICES = [
  {id:1, cat:"cleaning",  name_fr:"Nettoyage intérieur complet",      name_en:"Full Interior Cleaning",        desc_fr:"Dépoussiérage, sols, sanitaires, cuisine",           desc_en:"Dusting, floors, bathrooms, kitchen",           price:45000, duration:"3h",    badge:null},
  {id:2, cat:"cleaning",  name_fr:"Nettoyage des vitres",             name_en:"Window Cleaning",               desc_fr:"Intérieur et extérieur, encadrements inclus",        desc_en:"Interior & exterior, frames included",          price:25000, duration:"1h30",  badge:null},
  {id:3, cat:"cleaning",  name_fr:"Désinfection complète",            name_en:"Full Disinfection",             desc_fr:"Traitement antibactérien certifié",                  desc_en:"Certified antibacterial treatment",             price:65000, duration:"3h",    badge:null},
  {id:4, cat:"cleaning",  name_fr:"Nettoyage des fauteuils",          name_en:"Upholstery Cleaning",           desc_fr:"Nettoyage en profondeur des fauteuils et canapés",   desc_en:"Deep cleaning of armchairs and sofas",          price:35000, duration:"2h",    badge:"new"},
  {id:5, cat:"gardening", name_fr:"Tonte et entretien du gazon",      name_en:"Lawn Mowing & Care",            desc_fr:"Tonte, ramassage, fertilisation",                    desc_en:"Mowing, collection, fertilisation",             price:35000, duration:"2h",    badge:null},
  {id:6, cat:"gardening", name_fr:"Taille de haies et arbustes",      name_en:"Hedge & Shrub Trimming",        desc_fr:"Taille soignée, évacuation des déchets verts",       desc_en:"Careful trimming, green waste removal",         price:30000, duration:"2h",    badge:null},
  {id:7, cat:"gardening", name_fr:"Décorations de jardin",            name_en:"Garden Decorations",            desc_fr:"Aménagement et décoration paysagère sur mesure",     desc_en:"Custom landscaping and garden decoration",      price:75000, duration:"4h",    badge:"exceptional"},
  {id:8, cat:"hvac",      name_fr:"Nettoyage des filtres climatiseur",name_en:"AC Filter Cleaning",            desc_fr:"Nettoyage et vérification des filtres",              desc_en:"Filter cleaning and inspection",                price:28000, duration:"1h",    badge:null},
  {id:9, cat:"hvac",      name_fr:"Vérification complète du circuit", name_en:"Full Circuit Check",            desc_fr:"Diagnostic complet, rapport d'état",                 desc_en:"Full diagnostic, condition report",             price:55000, duration:"2h",    badge:null},
  {id:10,cat:"hvac",      name_fr:"Recharge en fluide frigorigène",   name_en:"Refrigerant Recharge",          desc_fr:"Recharge certifiée avec rapport officiel",           desc_en:"Certified recharge with official report",       price:85000, duration:"2h30",  badge:null},
  {id:11,cat:"hvac",      name_fr:"Dépannage électronique",           name_en:"Electronic Troubleshooting",    desc_fr:"Diagnostic et réparation des pannes électroniques",  desc_en:"Diagnosis and repair of electronic faults",     price:50000, duration:"2h",    badge:"new"},
];

// ═══════════════════════════════════════════════════════
// DONNÉES CALENDRIER — réservations existantes
// ═══════════════════════════════════════════════════════
const CALENDAR_BOOKINGS = [
  {date:"2025-04-03",client:"Thomas Mbouassono",  service_fr:"Tonte du gazon",           service_en:"Lawn Mowing",         time:"09h00",agent:"Jean-Baptiste M.",status:"confirmed"},
  {date:"2025-04-03",client:"Christelle Biyong",  service_fr:"Nettoyage intérieur",      service_en:"Interior Cleaning",   time:"14h00",agent:"Marie-Claire K.", status:"confirmed"},
  {date:"2025-04-07",client:"Patrick Nkengni",    service_fr:"Vérification circuit",     service_en:"Circuit Check",       time:"10h00",agent:"Paul Ateba",       status:"confirmed"},
  {date:"2025-04-08",client:"Hélène Owona",       service_fr:"Nettoyage fauteuils",      service_en:"Upholstery Cleaning", time:"14h00",agent:"Sophie Nkomo",     status:"pending"},
  {date:"2025-04-10",client:"Robert Tchamba",     service_fr:"Désinfection complète",    service_en:"Full Disinfection",   time:"08h00",agent:"Jean-Baptiste M.", status:"confirmed"},
  {date:"2025-04-14",client:"Françoise Essomba",  service_fr:"Taille de haies",          service_en:"Hedge Trimming",      time:"09h00",agent:"Marie-Claire K.", status:"confirmed"},
  {date:"2025-04-14",client:"Martin Bello",       service_fr:"Nettoyage filtres clim.",  service_en:"AC Filter Cleaning",  time:"15h00",agent:"Paul Ateba",       status:"pending"},
  {date:"2025-04-17",client:"Sophie Atangana",    service_fr:"Nettoyage vitres",         service_en:"Window Cleaning",     time:"10h00",agent:"Sophie Nkomo",     status:"confirmed"},
  {date:"2025-04-21",client:"Jean-Marc Fouda",    service_fr:"Décorations de jardin",   service_en:"Garden Decorations",  time:"08h00",agent:"Jean-Baptiste M.", status:"confirmed"},
  {date:"2025-04-24",client:"Yvonne Manga",       service_fr:"Dépannage électronique",  service_en:"Electronic Troublesh.",time:"11h00",agent:"Paul Ateba",       status:"pending"},
  {date:"2025-04-28",client:"Thomas Mbouassono",  service_fr:"Nettoyage intérieur",     service_en:"Interior Cleaning",   time:"14h00",agent:"Marie-Claire K.", status:"confirmed"},
];

const AGENTS = [
  {id:1,name:"Jean-Baptiste Mballa",skills_fr:["Nettoyage","Jardinage"],skills_en:["Cleaning","Gardening"],status:"inProgress",zone:"Bastos",   rating:4.8},
  {id:2,name:"Marie-Claire Kamga",  skills_fr:["Nettoyage"],            skills_en:["Cleaning"],            status:"onRoute",   zone:"Akwa",     rating:4.9},
  {id:3,name:"Paul Ateba",          skills_fr:["Climatisation"],         skills_en:["HVAC"],                status:"completed", zone:"Bonanjo",  rating:4.7},
  {id:4,name:"Sophie Nkomo",        skills_fr:["Nettoyage","Clim."],     skills_en:["Cleaning","HVAC"],     status:"arrived",   zone:"Bonapriso",rating:4.6},
];

const BOOKINGS_0 = [
  {id:"LMP-2025-0847",service_fr:"Tonte et entretien du gazon", service_en:"Lawn Mowing & Care",    date:"05 avril 2025",time:"09h00",agent:"Jean-Baptiste M.",status:"confirmed",amount:35000,reviewed:false},
  {id:"LMP-2025-0791",service_fr:"Nettoyage intérieur complet", service_en:"Full Interior Cleaning",date:"08 avril 2025",time:"14h00",agent:"Marie-Claire K.", status:"pending",  amount:45000,reviewed:false},
  {id:"LMP-2025-0634",service_fr:"Nettoyage des filtres",       service_en:"Filter Cleaning",       date:"28 mars 2025", time:"10h00",agent:"Paul Ateba",       status:"completed",amount:28000,reviewed:false},
  {id:"LMP-2025-0521",service_fr:"Désinfection complète",       service_en:"Full Disinfection",     date:"15 mars 2025", time:"08h00",agent:"Sophie Nkomo",     status:"completed",amount:65000,reviewed:true},
];

const REVIEWS_0 = [
  {id:1,client:"M. Thomas Mbouassono", ref:"LMP-2025-0512",service_fr:"Nettoyage intérieur",service_en:"Interior Cleaning",   date:"20 mars 2025",rating:4,content:"Travail soigné et personnel ponctuel. Je recommande vivement ce service."},
  {id:2,client:"Mme Christelle Biyong",ref:"LMP-2025-0498",service_fr:"Taille de haies",    service_en:"Hedge Trimming",      date:"18 mars 2025",rating:5,content:"Résultat impeccable, l'agent a fait preuve d'un soin particulier pour les arbustes fragiles."},
  {id:3,client:"M. Patrick Nkengni",  ref:"LMP-2025-0456",service_fr:"Recharge frigorigène",service_en:"Refrigerant Recharge",date:"15 mars 2025",rating:3,content:"Intervention correcte mais délai d'attente un peu long avant l'arrivée de l'agent."},
];

const FOLLOWUPS = [
  {id:1,client:"Mme Françoise Essomba",phone:"+237 699 001 122",lastSvc_fr:"Nettoyage intérieur",lastSvc_en:"Interior Cleaning",lastDate:"12 fév. 2025",reason_fr:"Abonnement mensuel non renouvelé",  reason_en:"Monthly subscription not renewed", lastContact:"01 mars 2025",urgency:"urgent"},
  {id:2,client:"M. Robert Tchamba",    phone:"+237 677 223 344",lastSvc_fr:"Tonte de gazon",      lastSvc_en:"Lawn Mowing",       lastDate:"28 jan. 2025",reason_fr:"Relance abonnement trimestriel",   reason_en:"Quarterly subscription follow-up",lastContact:"15 fév. 2025",urgency:"normal"},
  {id:3,client:"Mme Hélène Owona",     phone:"+237 655 445 566",lastSvc_fr:"Nettoyage vitres",    lastSvc_en:"Window Cleaning",   lastDate:"05 mars 2025",reason_fr:"Satisfaction à confirmer",         reason_en:"Satisfaction to confirm",         lastContact:"—",          urgency:"new_"},
];

const REVENUE = [{m:"Jan",conf:850,proj:850},{m:"Fév",conf:920,proj:920},{m:"Mar",conf:1100,proj:1100},{m:"Avr",conf:420,proj:1280}];
const WHEEL_COLORS = [C.forestGreen,C.steelBlue,C.lightGreen,C.skyBlue,"#2E7D32","#1565C0"];
const PRIZES_FR = ["15% de réduction","Points × 2","Prestation offerte","500 points bonus","10% de réduction","Cadeau surprise"];
const PRIZES_EN = ["15% discount","Double Points","Free Service","500 bonus points","10% discount","Surprise gift"];

// ═══════════════════════════════════════════════════════
// COMPOSANTS PURS
// ═══════════════════════════════════════════════════════
function Badge({status,lang}){
  const M={confirmed:{bg:"#E8F5E9",fg:"#228B22",fr:"Confirmé",en:"Confirmed"},pending:{bg:"#FFF8E1",fg:"#D4860A",fr:"En attente",en:"Pending"},completed:{bg:"#E3F2FD",fg:"#4682B4",fr:"Réalisé",en:"Completed"},cancelled:{bg:"#FFEBEE",fg:"#C0392B",fr:"Annulé",en:"Cancelled"},inProgress:{bg:"#E8F5E9",fg:"#2E7D32",fr:"En cours",en:"In Progress"},onRoute:{bg:"#E3F2FD",fg:"#4682B4",fr:"En route",en:"On Route"},arrived:{bg:"#E8EAF6",fg:"#3949AB",fr:"Sur place",en:"On Site"},urgent:{bg:"#FFEBEE",fg:"#C0392B",fr:"Urgent",en:"Urgent"},normal:{bg:"#FFF8E1",fg:"#D4860A",fr:"À relancer",en:"Follow up"},new_:{bg:"#E8F5E9",fg:"#228B22",fr:"Nouveau",en:"New"}};
  const s=M[status]||M.pending;
  return <span style={{padding:"3px 11px",borderRadius:20,fontSize:11,fontFamily:body,fontWeight:700,background:s.bg,color:s.fg,whiteSpace:"nowrap"}}>{lang==="fr"?s.fr:s.en}</span>;
}

function Stars({value,onChange,size=24}){
  return <div style={{display:"flex",gap:4}}>{[1,2,3,4,5].map(n=><span key={n} onClick={()=>onChange&&onChange(n)} style={{fontSize:size,color:n<=value?"#F4B400":"#C8DFF0",cursor:onChange?"pointer":"default",userSelect:"none",transition:"color 0.15s"}}>★</span>)}</div>;
}

function PCard({pattern,children,style}){
  return(
    <div style={{position:"relative",borderRadius:16,overflow:"hidden",...style}}>
      <div style={{position:"absolute",inset:0,backgroundImage:bg(pattern),backgroundSize:"120px 120px",backgroundRepeat:"repeat",pointerEvents:"none"}}/>
      <div style={{position:"relative",zIndex:1}}>{children}</div>
    </div>
  );
}

function HR({style}){return <div style={{height:1,background:"#E0EDF8",...style}}/>;  }
function FRow({label,value}){
  return <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:12,color:C.mist,fontFamily:body}}>{label}</span><span style={{fontSize:12,color:C.slate,fontFamily:body,fontWeight:700}}>{value}</span></div>;
}

function Btn({children,onClick,variant="primary",style={},disabled=false}){
  const V={primary:{background:`linear-gradient(135deg,${C.forestGreen},#1a6e1a)`,color:"#fff",border:"none"},secondary:{background:C.skyBluePale,color:C.steelBlue,border:`1.5px solid ${C.skyBlueMid}`},blue:{background:`linear-gradient(135deg,${C.steelBlue},#2a5a9a)`,color:"#fff",border:"none"},ghost:{background:"transparent",color:C.mist,border:"1.5px solid #D8EAF6"},danger:{background:"#FFF0EE",color:C.error,border:"1.5px solid #FFCDD2"},orange:{background:`linear-gradient(135deg,${C.orange},#e65000)`,color:"#fff",border:"none"},mtn:{background:`linear-gradient(135deg,${C.mtn},#e6b800)`,color:"#333",border:"none"}};
  const v=V[variant]||V.primary;
  return <button onClick={onClick} disabled={disabled} style={{padding:"11px 0",borderRadius:10,fontSize:13,fontFamily:body,fontWeight:700,letterSpacing:"0.02em",cursor:disabled?"not-allowed":"pointer",opacity:disabled?.5:1,transition:"all 0.18s",...v,...style}}>{children}</button>;
}

// ═══════════════════════════════════════════════════════
// BANNIÈRE PUBLICITAIRE
// ═══════════════════════════════════════════════════════
function AdBanner({lang}){
  const [idx,setIdx]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setIdx(i=>(i+1)%ADS.length),5000);return()=>clearInterval(t);},[]);
  const ad=ADS[idx];
  return(
    <div style={{position:"relative",borderRadius:0,overflow:"hidden",flexShrink:0}}>
      <div style={{background:ad.bg,padding:"8px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",minHeight:44,transition:"background 0.5s"}}>
        <div style={{fontSize:11.5,color:"#fff",fontFamily:body,fontWeight:700,flex:1,lineHeight:1.3,paddingRight:8}}>
          {lang==="fr"?ad.text_fr:ad.text_en}
        </div>
        <button style={{background:"rgba(255,255,255,0.22)",border:"1px solid rgba(255,255,255,0.4)",color:"#fff",fontSize:10,fontFamily:body,fontWeight:700,padding:"4px 10px",borderRadius:12,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>
          {lang==="fr"?ad.cta_fr:ad.cta_en}
        </button>
        {/* Dots */}
        <div style={{display:"flex",gap:3,marginLeft:8}}>
          {ADS.map((_,i)=><div key={i} style={{width:5,height:5,borderRadius:"50%",background:i===idx?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.35)",transition:"background 0.3s"}}/>)}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MODAL PAIEMENT MOBILE MONEY
// ═══════════════════════════════════════════════════════
function PaymentModal({service,lang,onSuccess,onCancel}){
  const [provider,setProvider]=useState("orange");
  const [phone,setPhone]=useState("");
  const [step,setStep]=useState("form"); // form | pending | success | error
  const [countdown,setCountdown]=useState(30);

  useEffect(()=>{
    if(step==="pending"){
      const t=setInterval(()=>setCountdown(c=>{
        if(c<=1){clearInterval(t);setStep("success");return 30;}
        return c-1;
      }),1000);
      return()=>clearInterval(t);
    }
  },[step]);

  const initPayment=()=>{
    if(phone.replace(/\s/g,"").length<9){return;}
    setStep("pending");
  };

  const providerInfo={
    orange:{name:"Orange Money",color:C.orange,prefix:"+237 6",logo:"🟠"},
    mtn:{name:"MTN Mobile Money",color:C.mtn,textColor:"#333",prefix:"+237 6",logo:"🟡"},
  };
  const pInfo=providerInfo[provider];

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(74,94,114,0.55)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{background:C.white,borderRadius:"24px 24px 0 0",width:"100%",maxWidth:480,padding:"28px 24px 40px",boxShadow:"0 -8px 40px rgba(70,130,180,0.2)"}}>

        {/* Poignée */}
        <div style={{width:40,height:4,borderRadius:99,background:C.fog,margin:"0 auto 24px"}}/>

        {step==="form" && <>
          <div style={{fontSize:20,color:C.slate,fontFamily:display,fontWeight:700,marginBottom:4}}>
            {lang==="fr"?"Paiement sécurisé":"Secure Payment"}
          </div>
          <div style={{fontSize:13,color:C.mist,fontFamily:body,marginBottom:22}}>
            {lang==="fr"?service.name_fr:service.name_en} — <strong style={{color:C.forestGreen}}>{(service.price/1000).toFixed(0)} 000 FCFA</strong>
          </div>

          {/* Choix opérateur */}
          <div style={{fontSize:11,color:C.mist,fontFamily:body,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:10}}>
            {lang==="fr"?"Choisir l'opérateur":"Choose Operator"}
          </div>
          <div style={{display:"flex",gap:10,marginBottom:20}}>
            {[
              {id:"orange",label:"Orange Money",color:C.orange,logo:"🟠"},
              {id:"mtn",   label:"MTN MoMo",    color:C.mtn,  logo:"🟡"},
            ].map(op=>(
              <div key={op.id} onClick={()=>setProvider(op.id)} style={{
                flex:1,padding:"14px 10px",borderRadius:12,textAlign:"center",cursor:"pointer",
                border:`2px solid ${provider===op.id?op.color:C.fog}`,
                background:provider===op.id?`${op.color}12`:C.cream,
                transition:"all 0.15s",
              }}>
                <div style={{fontSize:24,marginBottom:4}}>{op.logo}</div>
                <div style={{fontSize:12,color:C.slate,fontFamily:body,fontWeight:700}}>{op.label}</div>
              </div>
            ))}
          </div>

          {/* Numéro */}
          <div style={{fontSize:11,color:C.mist,fontFamily:body,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:8}}>
            {lang==="fr"?"Numéro de téléphone":"Phone Number"}
          </div>
          <div style={{display:"flex",gap:8,marginBottom:6}}>
            <div style={{padding:"13px 12px",background:C.cloud,borderRadius:10,border:`1.5px solid ${C.fog}`,fontSize:14,color:C.slate,fontFamily:body,fontWeight:700,whiteSpace:"nowrap"}}>
              +237
            </div>
            <input
              value={phone} onChange={e=>setPhone(e.target.value.replace(/[^0-9\s]/g,""))}
              placeholder="6XX XXX XXX"
              maxLength={11}
              style={{flex:1,padding:"13px 14px",background:C.cream,borderRadius:10,border:`1.5px solid ${phone.length>=9?C.forestGreen:C.fog}`,fontSize:15,color:C.slate,fontFamily:body,fontWeight:700,outline:"none"}}
            />
          </div>
          <div style={{fontSize:11,color:C.mist,fontFamily:body,marginBottom:20}}>
            {lang==="fr"
              ?"Vous recevrez un ordre de débit sur ce numéro à valider depuis votre téléphone."
              :"You will receive a debit request on this number to confirm from your phone."}
          </div>

          {/* Sécurité */}
          <div style={{background:C.skyBluePale,border:`1.5px solid ${C.skyBlueMid}`,borderRadius:10,padding:"10px 14px",marginBottom:20,fontSize:11,color:C.steelBlue,fontFamily:body,lineHeight:1.6}}>
            {lang==="fr"
              ?"🔒 Vos données financières ne sont jamais stockées. Seul votre numéro est utilisé pour initier le paiement."
              :"🔒 Your financial data is never stored. Only your number is used to initiate the payment."}
          </div>

          <Btn onClick={initPayment} disabled={phone.replace(/\s/g,"").length<9}
            variant={provider==="mtn"?"mtn":"orange"}
            style={{width:"100%",borderRadius:12,padding:"14px 0",fontSize:14}}>
            {lang==="fr"?`Payer via ${pInfo.name}`:`Pay via ${pInfo.name}`}
          </Btn>
          <Btn onClick={onCancel} variant="ghost" style={{width:"100%",borderRadius:12,padding:"10px 0",marginTop:8,fontSize:13}}>
            {lang==="fr"?"Annuler":"Cancel"}
          </Btn>
        </>}

        {step==="pending" && (
          <div style={{textAlign:"center",padding:"16px 0"}}>
            {/* Spinner */}
            <div style={{
              width:70,height:70,borderRadius:35,margin:"0 auto 20px",
              border:`5px solid ${C.fog}`,borderTop:`5px solid ${provider==="orange"?C.orange:C.mtn}`,
              animation:"spin 1s linear infinite",
            }}/>
            <div style={{fontSize:20,color:C.slate,fontFamily:display,fontWeight:700,marginBottom:8}}>
              {lang==="fr"?"En attente de confirmation":"Awaiting Confirmation"}
            </div>
            <div style={{fontSize:13,color:C.mist,fontFamily:body,lineHeight:1.7,marginBottom:16}}>
              {lang==="fr"
                ?<>Un ordre de débit a été envoyé au <strong>+237 {phone}</strong>.<br/>Validez la transaction depuis votre téléphone.</>
                :<>A debit request has been sent to <strong>+237 {phone}</strong>.<br/>Confirm the transaction from your phone.</>}
            </div>
            <div style={{
              width:70,height:70,borderRadius:35,margin:"0 auto",
              background:`${provider==="orange"?C.orange:C.mtn}18`,border:`2px solid ${provider==="orange"?C.orange:C.mtn}`,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:28,fontFamily:display,fontWeight:700,color:provider==="orange"?C.orange:C.slate,
            }}>{countdown}</div>
            <div style={{fontSize:11,color:C.mist,fontFamily:body,marginTop:6}}>
              {lang==="fr"?"Expiration dans":"Expires in"} {countdown}s
            </div>
          </div>
        )}

        {step==="success" && (
          <div style={{textAlign:"center",padding:"16px 0"}}>
            <div style={{width:72,height:72,borderRadius:36,background:C.greenPale,border:`2px solid ${C.lightGreen}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:30,color:C.forestGreen}}>✓</div>
            <div style={{fontSize:22,color:C.forestGreen,fontFamily:display,fontWeight:700,marginBottom:8}}>
              {lang==="fr"?"Paiement confirmé !":"Payment Confirmed!"}
            </div>
            <div style={{fontSize:13,color:C.mist,fontFamily:body,lineHeight:1.7,marginBottom:24}}>
              {lang==="fr"
                ?<>Votre réservation est confirmée.<br/>Un récapitulatif vous sera envoyé par SMS.</>
                :<>Your booking is confirmed.<br/>A summary will be sent to you by SMS.</>}
            </div>
            <Btn onClick={onSuccess} style={{width:"100%",borderRadius:12,padding:"14px 0"}}>
              {lang==="fr"?"Voir mon planning":"View My Schedule"}
            </Btn>
          </div>
        )}

        {step==="error" && (
          <div style={{textAlign:"center",padding:"16px 0"}}>
            <div style={{width:72,height:72,borderRadius:36,background:"#FFEBEE",border:"2px solid #FFCDD2",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:30,color:C.error}}>✗</div>
            <div style={{fontSize:22,color:C.error,fontFamily:display,fontWeight:700,marginBottom:8}}>
              {lang==="fr"?"Paiement échoué":"Payment Failed"}
            </div>
            <Btn onClick={()=>setStep("form")} variant="ghost" style={{width:"100%",borderRadius:12,padding:"14px 0",marginTop:8}}>
              {lang==="fr"?"Réessayer":"Try Again"}
            </Btn>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// CALENDRIER SECRÉTARIAT
// ═══════════════════════════════════════════════════════
function SecretaryCalendar({lang}){
  const [view,setView]=useState("monthly");
  const [selectedDay,setSelectedDay]=useState(null);

  const DAYS_LABELS_FR=["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];
  const DAYS_LABELS_EN=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const dayLabels=lang==="fr"?DAYS_LABELS_FR:DAYS_LABELS_EN;

  // Générer les jours d'avril 2025 (1er = mardi, idx=1)
  const firstDayOfWeek=1; // Mardi
  const daysInMonth=30;
  const blanks=Array(firstDayOfWeek).fill(null);
  const days=Array.from({length:daysInMonth},(_,i)=>i+1);

  const getBookingsForDay = d => {
    const dateStr=`2025-04-${String(d).padStart(2,"0")}`;
    return CALENDAR_BOOKINGS.filter(b=>b.date===dateStr);
  };

  const hasConflict = d => getBookingsForDay(d).length > 1;
  const hasBooking  = d => getBookingsForDay(d).length > 0;

  const viewLabels_fr={monthly:"Mensuel",quarterly:"Trimestriel",semiannual:"Semestriel",annual:"Annuel"};
  const viewLabels_en={monthly:"Monthly",quarterly:"Quarterly",semiannual:"Semi-annual",annual:"Annual"};
  const viewLabels=lang==="fr"?viewLabels_fr:viewLabels_en;

  return(
    <div>
      {/* Sélecteur de vue */}
      <div style={{display:"flex",gap:5,overflowX:"auto",paddingBottom:4,marginBottom:16}}>
        {Object.keys(viewLabels).map(v=>(
          <button key={v} onClick={()=>{setView(v);setSelectedDay(null);}} style={{
            flexShrink:0,padding:"6px 14px",borderRadius:20,fontSize:11,fontFamily:body,fontWeight:700,
            background:view===v?C.steelBlue:C.white,color:view===v?"#fff":C.mist,
            border:`1.5px solid ${view===v?C.steelBlue:C.fog}`,cursor:"pointer",
          }}>{viewLabels[v]}</button>
        ))}
      </div>

      {/* Vue mensuelle détaillée */}
      {view==="monthly" && (
        <div>
          <div style={{fontSize:16,color:C.slate,fontFamily:display,fontWeight:700,marginBottom:12}}>Avril 2025</div>

          {/* Légende */}
          <div style={{display:"flex",gap:12,marginBottom:14,flexWrap:"wrap"}}>
            {[
              {color:C.forestGreen, label:lang==="fr"?"Réservé":"Booked"},
              {color:C.error,       label:lang==="fr"?"Conflit":"Conflict"},
              {color:C.fog,         label:lang==="fr"?"Libre":"Free"},
            ].map((l,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:5}}>
                <div style={{width:10,height:10,borderRadius:3,background:l.color}}/>
                <span style={{fontSize:11,color:C.mist,fontFamily:body}}>{l.label}</span>
              </div>
            ))}
          </div>

          {/* Grille */}
          <div style={{background:C.white,borderRadius:14,border:`1.5px solid ${C.fog}`,overflow:"hidden"}}>
            {/* Jours de la semaine */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",background:C.skyBluePale,borderBottom:`1px solid ${C.fog}`}}>
              {dayLabels.map((d,i)=>(
                <div key={i} style={{fontSize:10,color:C.mist,fontFamily:body,fontWeight:700,textAlign:"center",padding:"8px 0",textTransform:"uppercase"}}>{d}</div>
              ))}
            </div>
            {/* Jours */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)"}}>
              {blanks.map((_,i)=><div key={`b${i}`} style={{borderRight:`1px solid ${C.fog}`,borderBottom:`1px solid ${C.fog}`,minHeight:48}}/>)}
              {days.map(d=>{
                const bks=getBookingsForDay(d);
                const conflict=bks.length>1;
                const booked=bks.length>0;
                const isSelected=selectedDay===d;
                const isToday=d===3;
                return(
                  <div key={d} onClick={()=>setSelectedDay(isSelected?null:d)} style={{
                    borderRight:`1px solid ${C.fog}`,borderBottom:`1px solid ${C.fog}`,
                    minHeight:52,padding:4,cursor:"pointer",
                    background:isSelected?`${C.steelBlue}10`:conflict?`${C.error}08`:booked?`${C.forestGreen}06`:"transparent",
                    transition:"background 0.15s",
                  }}>
                    <div style={{
                      width:22,height:22,borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",
                      margin:"0 auto 3px",fontSize:12,fontFamily:body,fontWeight:700,
                      background:isToday?C.steelBlue:isSelected?C.steelBlue:"transparent",
                      color:isToday||isSelected?"#fff":C.slate,
                    }}>{d}</div>
                    {booked && (
                      <div style={{display:"flex",flexDirection:"column",gap:1}}>
                        {bks.slice(0,2).map((b,i)=>(
                          <div key={i} style={{
                            fontSize:8,fontFamily:body,fontWeight:700,
                            padding:"1px 3px",borderRadius:3,lineHeight:1.2,
                            background:conflict?`${C.error}18`:`${C.forestGreen}15`,
                            color:conflict?C.error:C.forestGreen,
                            overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",
                          }}>{b.time} {lang==="fr"?b.service_fr:b.service_en}</div>
                        ))}
                        {bks.length>2&&<div style={{fontSize:7,color:C.mist,fontFamily:body,textAlign:"center"}}>+{bks.length-2}</div>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Détail du jour sélectionné */}
          {selectedDay && getBookingsForDay(selectedDay).length>0 && (
            <div style={{marginTop:14}}>
              <div style={{fontSize:13,color:C.slate,fontFamily:display,fontWeight:700,marginBottom:10}}>
                {lang==="fr"?`Interventions du ${selectedDay} avril`:`Interventions on April ${selectedDay}`}
                {hasConflict(selectedDay)&&<span style={{marginLeft:8,padding:"2px 8px",borderRadius:10,background:`${C.error}15`,color:C.error,fontSize:10,fontFamily:body,fontWeight:700}}>{lang==="fr"?"Conflit détecté":"Conflict detected"}</span>}
              </div>
              {getBookingsForDay(selectedDay).map((b,i)=>(
                <div key={i} style={{background:C.white,borderRadius:10,padding:"13px 15px",marginBottom:8,border:`1.5px solid ${hasConflict(selectedDay)?`${C.error}30`:C.fog}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                    <div>
                      <div style={{fontSize:13,color:C.slate,fontFamily:display,fontWeight:600}}>{b.client}</div>
                      <div style={{fontSize:12,color:C.mist,fontFamily:body,marginTop:2}}>{lang==="fr"?b.service_fr:b.service_en}</div>
                    </div>
                    <Badge status={b.status} lang={lang}/>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.mist,fontFamily:body}}>
                    <span>{b.time} · {b.agent}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Vues condensées : trimestriel, semestriel, annuel */}
      {view!=="monthly" && (
        <div>
          {[
            {label:lang==="fr"?"Avril 2025":"April 2025",    count:CALENDAR_BOOKINGS.length,     conflicts:2},
            {label:lang==="fr"?"Mai 2025":"May 2025",         count:8,                             conflicts:0},
            {label:lang==="fr"?"Juin 2025":"June 2025",       count:11,                            conflicts:1},
            ...(view==="semiannual"||view==="annual"?[
              {label:lang==="fr"?"Juillet 2025":"July 2025",  count:7,  conflicts:0},
              {label:lang==="fr"?"Août 2025":"August 2025",   count:5,  conflicts:0},
              {label:lang==="fr"?"Septembre 2025":"Sept. 2025",count:9, conflicts:1},
            ]:[]),
            ...(view==="annual"?[
              {label:lang==="fr"?"Octobre 2025":"October 2025", count:12,conflicts:0},
              {label:lang==="fr"?"Novembre 2025":"November 2025",count:9,conflicts:0},
              {label:lang==="fr"?"Décembre 2025":"December 2025",count:14,conflicts:2},
            ]:[]),
          ].map((m,i)=>(
            <div key={i} style={{background:C.white,borderRadius:12,padding:"14px 16px",marginBottom:8,border:`1.5px solid ${m.conflicts>0?`${C.error}30`:C.fog}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:14,color:C.slate,fontFamily:display,fontWeight:600}}>{m.label}</div>
                <div style={{fontSize:11,color:C.mist,fontFamily:body,marginTop:2}}>
                  {m.count} {lang==="fr"?"interventions planifiées":"planned interventions"}
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                {m.conflicts>0&&(
                  <div style={{fontSize:11,color:C.error,fontFamily:body,fontWeight:700,marginBottom:3}}>
                    {m.conflicts} {lang==="fr"?"conflit(s)":"conflict(s)"}
                  </div>
                )}
                <div style={{fontSize:11,color:C.forestGreen,fontFamily:body,fontWeight:700}}>
                  {m.conflicts===0?(lang==="fr"?"Aucun conflit":"No conflict"):""}
                </div>
              </div>
            </div>
          ))}

          {/* Graphe barres mois */}
          <div style={{background:C.white,borderRadius:14,padding:18,marginTop:14,border:`1.5px solid ${C.fog}`}}>
            <div style={{fontSize:13,color:C.slate,fontFamily:display,fontWeight:700,marginBottom:14}}>
              {lang==="fr"?"Charge mensuelle":"Monthly Load"}
            </div>
            <div style={{display:"flex",alignItems:"flex-end",gap:8,height:80}}>
              {[{m:"Avr",v:11},{m:"Mai",v:8},{m:"Jun",v:11},{m:"Jul",v:7},{m:"Aoû",v:5},{m:"Sep",v:9}].map((d,i)=>(
                <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <div style={{width:"100%",borderRadius:"4px 4px 0 0",background:i===0?C.steelBlue:C.skyBlueMid,height:`${(d.v/14)*60}px`,transition:"height 0.4s ease"}}/>
                  <div style={{fontSize:9,color:C.mist,fontFamily:body,fontWeight:700,textTransform:"uppercase"}}>{d.m}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// POLITIQUE DE CONFIDENTIALITÉ — Vue
// ═══════════════════════════════════════════════════════
function PrivacyView({lang,onBack}){
  const sections=lang==="fr"?PRIVACY_FR:PRIVACY_EN;
  return(
    <div style={{padding:"0 20px 110px"}}>
      <button onClick={onBack} style={{fontSize:13,color:C.mist,fontFamily:body,marginBottom:20,display:"flex",alignItems:"center",gap:5}}>← {lang==="fr"?"Retour":"Back"}</button>
      <PCard pattern={P.clean} style={{background:`linear-gradient(135deg,${C.skyBluePale},${C.skyBlueMid})`,padding:"20px",marginBottom:24}}>
        <div style={{fontSize:22,color:C.slate,fontFamily:display,fontWeight:700,marginBottom:4}}>
          {lang==="fr"?"Politique de Confidentialité":"Privacy Policy"}
        </div>
        <div style={{fontSize:11,color:C.mist,fontFamily:body}}>Limpidus · Version 1.0 · Avril 2025</div>
      </PCard>
      {sections.map((s,i)=>(
        <div key={i} style={{marginBottom:22}}>
          <div style={{fontSize:14,color:C.steelBlue,fontFamily:display,fontWeight:700,marginBottom:7,display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:3,height:14,borderRadius:2,background:C.steelBlue,flexShrink:0}}/>
            {s.title}
          </div>
          <div style={{fontSize:13,color:C.slate,fontFamily:body,lineHeight:1.8,whiteSpace:"pre-line"}}>
            {s.text}
          </div>
          {i<sections.length-1&&<HR style={{marginTop:20}}/>}
        </div>
      ))}
      <div style={{marginTop:24,padding:"12px 16px",borderRadius:12,background:C.greenPale,border:`1.5px solid ${C.greenMid}`,fontSize:12,color:C.forestGreen,fontFamily:body}}>
        {lang==="fr"
          ?"En utilisant LIMPIDUS, vous confirmez avoir lu et accepté cette politique de confidentialité."
          :"By using LIMPIDUS, you confirm that you have read and accepted this privacy policy."}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// APP PRINCIPALE
// ═══════════════════════════════════════════════════════
export default function LimpidusApp(){

  // ── Tous les états ──────────────────────────────────
  const [lang,          setLang]         = useState("fr");
  const [screen,        setScreen]       = useState("splash");
  const [role,          setRole]         = useState("client");
  const [tab,           setTab]          = useState("home");
  const [authMode,      setAuthMode]     = useState("login");
  // Inscription
  const [regName,       setRegName]      = useState("");
  const [regEmail,      setRegEmail]     = useState("");
  const [regPhone,      setRegPhone]     = useState("");
  // Services
  const [catFilter,     setCatFilter]    = useState("all");
  const [bookSvc,       setBookSvc]      = useState(null);
  const [bookStep,      setBookStep]     = useState(1);
  const [bookSlot,      setBookSlot]     = useState("09h00");
  const [showPayModal,  setShowPayModal] = useState(false);
  // Avis
  const [reviewTarget,  setReviewTarget] = useState(null);
  const [ratings,       setRatings]      = useState({overall:0,punctuality:0,quality:0,courtesy:0});
  const [reviewText,    setReviewText]   = useState("");
  const [reviewSent,    setReviewSent]   = useState(false);
  const [bookings,      setBookings]     = useState(BOOKINGS_0);
  // Fidélité
  const [wAngle,        setWAngle]       = useState(0);
  const [wSpin,         setWSpin]        = useState(false);
  const [wPrize,        setWPrize]       = useState(null);
  const loyaltyPts = 2450;
  // Secrétariat
  const [modReviews,    setModReviews]   = useState(REVIEWS_0);
  // Admin
  const [revView,       setRevView]      = useState("monthly");
  // Navigation sous-pages
  const [subPage,       setSubPage]      = useState(null); // "privacy"

  const t = k => ({
    brand:"LIMPIDUS", tagline:lang==="fr"?"L'entretien de votre propriété, simplifié.":"Professional property maintenance, simplified.",
    login:lang==="fr"?"Connexion":"Sign In", register:lang==="fr"?"Créer un compte":"Create Account",
    email:lang==="fr"?"Adresse électronique":"Email Address", password:lang==="fr"?"Mot de passe":"Password",
    phone:lang==="fr"?"Numéro de téléphone":"Phone Number",
    fullName:lang==="fr"?"Nom et prénom":"Full Name",
    loginClient:lang==="fr"?"Connexion client":"Client Login",
    loginSecretary:lang==="fr"?"Accès secrétariat":"Secretary Access",
    loginAdmin:lang==="fr"?"Accès administration":"Admin Access",
    book:lang==="fr"?"Réserver":"Book",
    selectDate:lang==="fr"?"Choisir une date":"Select a Date",
    selectTime:lang==="fr"?"Créneau horaire":"Time Slot",
    loyaltyTitle:lang==="fr"?"Programme de fidélité":"Loyalty Programme",
    points:lang==="fr"?"points":"points",
    spinWheel:lang==="fr"?"Tourner la roue":"Spin the Wheel",
    spinInfo:lang==="fr"?"1 000 points pour tourner la roue":"1,000 points to spin the wheel",
    spinning:lang==="fr"?"En cours…":"Spinning…",
    congratulations:lang==="fr"?"Félicitations !":"Congratulations!",
    youWon:lang==="fr"?"Vous remportez":"You win",
    leaveReview:lang==="fr"?"Laisser un avis":"Leave a Review",
    reviewPlaceholder:lang==="fr"?"Décrivez votre expérience…":"Describe your experience…",
    reviewSubmit:lang==="fr"?"Soumettre l'avis":"Submit Review",
    reviewThanks:lang==="fr"?"Merci pour votre retour !":"Thank you for your feedback!",
    ratingLabel:lang==="fr"?"Note globale":"Overall Rating",
    punctuality:lang==="fr"?"Ponctualité":"Punctuality",
    quality:lang==="fr"?"Qualité du travail":"Quality of Work",
    courtesy:lang==="fr"?"Courtoisie":"Courtesy",
    pendingReviews:lang==="fr"?"Avis à modérer":"Reviews to Moderate",
    clientFollowUp:lang==="fr"?"Relances clients":"Client Follow-up",
    approveReview:lang==="fr"?"Valider":"Approve",
    rejectReview:lang==="fr"?"Rejeter":"Reject",
    sendFollowUp:lang==="fr"?"Envoyer la relance":"Send Follow-up",
    contactClient:lang==="fr"?"Appeler":"Call",
    lastContact:lang==="fr"?"Dernier contact":"Last Contact",
    noReviewsPending:lang==="fr"?"Aucun avis en attente.":"No pending reviews.",
    cashFlow:lang==="fr"?"Prévision de trésorerie":"Cash Flow Forecast",
    confirmedRev:lang==="fr"?"Revenus confirmés":"Confirmed Revenue",
    projectedRev:lang==="fr"?"Revenus prévisionnels":"Projected Revenue",
    byService:lang==="fr"?"Répartition par service":"Revenue by Service",
    paymentNote:lang==="fr"?"Paiement intégral exigé à la réservation. Aucun impayé n'est possible sur cette plateforme.":"Full payment required at booking. No outstanding payments possible.",
    language:lang==="fr"?"Langue":"Language",
    twoFA:lang==="fr"?"Double authentification":"Two-Factor Auth",
    privacy:lang==="fr"?"Politique de confidentialité":"Privacy Policy",
    deleteAccount:lang==="fr"?"Supprimer mon compte":"Delete My Account",
    logout:lang==="fr"?"Se déconnecter":"Sign Out",
    qrDisplay:lang==="fr"?"À afficher à votre domicile":"Display at your property",
    monthly:lang==="fr"?"Mensuel":"Monthly",
    yearly:lang==="fr"?"Annuel":"Yearly",
    teamManagement:lang==="fr"?"Gestion des équipes":"Team Management",
    assign:lang==="fr"?"Assigner":"Assign",
    checkIn:lang==="fr"?"Pointage":"Check-in",
    nextIntervention:lang==="fr"?"Prochaine intervention":"Next Intervention",
    recentActivity:lang==="fr"?"Activité récente":"Recent Activity",
    agentStatus:lang==="fr"?"État des agents":"Agent Status",
    confirm:lang==="fr"?"Confirmer":"Confirm",
    reschedule:lang==="fr"?"Reporter":"Reschedule",
    back:lang==="fr"?"Retour":"Back",
    continue_:lang==="fr"?"Continuer":"Continue",
    roles:lang==="fr"?"Gestion des rôles":"Role Management",
    auditLog:lang==="fr"?"Journal d'audit":"Audit Log",
    accountingExport:lang==="fr"?"Export comptable":"Accounting Export",
    reviewPosted:lang==="fr"?"Avis déposé":"Review posted",
    availableLabel:lang==="fr"?"Disponible":"Available",
    summaryLabel:lang==="fr"?"Récapitulatif":"Summary",
    paymentMethod:lang==="fr"?"Mode de paiement":"Payment Method",
    commentLabel:lang==="fr"?"Commentaire":"Comment",
    backToPlanning:lang==="fr"?"Retour au planning":"Back to planning",
    backToServices:lang==="fr"?"Retour aux services":"Back to services",
    quickActions:lang==="fr"?"Actions rapides":"Quick Actions",
    bookService:lang==="fr"?"Réserver un service":"Book a Service",
    mySchedule:lang==="fr"?"Mon planning":"My Schedule",
    loyaltyProg:lang==="fr"?"Fidélité":"Loyalty",
    myProfile:lang==="fr"?"Mon profil":"My Profile",
    levels:lang==="fr"?"Niveaux de fidélité":"Loyalty Levels",
    calendarTitle:lang==="fr"?"Calendrier global":"Global Calendar",
    calendarSub:lang==="fr"?"Visualisez les réservations et gérez les chevauchements":"View bookings and manage overlaps",
    clientsTitle:lang==="fr"?"Clients":"Clients",
    newService:lang==="fr"?"Nouveau":"New",
    exceptional:lang==="fr"?"Exceptionnel":"Exceptional",
    payNowMobile:lang==="fr"?"Payer par Mobile Money":"Pay via Mobile Money",
    continueGoogle:lang==="fr"?"Continuer avec Google":"Continue with Google",
    continueApple:lang==="fr"?"Continuer avec Apple":"Continue with Apple",
  }[k] ?? k);

  useEffect(()=>{
    if(screen==="splash"){const id=setTimeout(()=>setScreen("auth"),2600);return()=>clearTimeout(id);}
  },[screen]);

  const goLogin=r=>{setRole(r);setScreen("app");setTab(r==="admin"?"dashboard":r==="secretary"?"reviews":"home");};
  const spinWheel=()=>{
    if(wSpin||loyaltyPts<1000)return;
    setWSpin(true);setWPrize(null);
    setWAngle(a=>a+5*360+Math.random()*360);
    const idx=Math.floor(Math.random()*6);
    setTimeout(()=>{setWSpin(false);setWPrize({fr:PRIZES_FR[idx],en:PRIZES_EN[idx]});},3600);
  };
  const openReview=b=>{setReviewTarget(b);setRatings({overall:0,punctuality:0,quality:0,courtesy:0});setReviewText("");setReviewSent(false);setTab("review");};
  const submitReview=()=>{setReviewSent(true);setBookings(p=>p.map(b=>b.id===reviewTarget.id?{...b,reviewed:true}:b));};

  // NAV
  const NAV={
    client:[{id:"home",fr:"Accueil",en:"Home"},{id:"services",fr:"Services",en:"Services"},{id:"planning",fr:"Planning",en:"Planning"},{id:"loyalty",fr:"Fidélité",en:"Loyalty"},{id:"profile",fr:"Profil",en:"Profile"}],
    secretary:[{id:"reviews",fr:"Avis",en:"Reviews"},{id:"followup",fr:"Relances",en:"Follow-up"},{id:"calendar",fr:"Calendrier",en:"Calendar"},{id:"clients",fr:"Clients",en:"Clients"}],
    admin:[{id:"dashboard",fr:"Tableau",en:"Dashboard"},{id:"team",fr:"Équipes",en:"Teams"},{id:"finance",fr:"Finances",en:"Finance"},{id:"settings",fr:"Paramètres",en:"Settings"}],
  };
  const navTabs=NAV[role]||NAV.client;
  const activeId=navTabs.find(x=>x.id===tab)?tab:navTabs[0].id;
  const navIcon=id=>({home:"⌂",dashboard:"▣",services:"◈",reviews:"◈",planning:"▦",calendar:"▦",schedule:"▦",team:"▦",loyalty:"◆",followup:"◆",finance:"◆",profile:"○",clients:"○",settings:"○"}[id]||"○");

  const pageTitle=()=>{
    if(tab==="review")return lang==="fr"?"Laisser un avis":"Leave a Review";
    if(subPage==="privacy")return lang==="fr"?"Confidentialité":"Privacy";
    const f=navTabs.find(x=>x.id===tab);
    return f?(lang==="fr"?f.fr:f.en):"";
  };
  const roleSub=()=>role==="admin"?(lang==="fr"?"Administration":"Administration"):role==="secretary"?(lang==="fr"?"Secrétariat":"Secretary"):(lang==="fr"?"Espace client":"Client Portal");

  // ────────────────────────────────────────────────────
  // SPLASH
  // ────────────────────────────────────────────────────
  if(screen==="splash")return(
    <div style={{width:"100%",height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:`linear-gradient(160deg,${C.skyBlue} 0%,${C.steelBlue} 100%)`,position:"relative",overflow:"hidden"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;700&display=swap');@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes barIn{from{width:0}to{width:72%}}@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}*{box-sizing:border-box;margin:0;padding:0;}button{cursor:pointer;border:none;background:transparent;}::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{background:${C.skyBlueMid};border-radius:4px;}textarea{outline:none;resize:none;}input{outline:none;}`}</style>
      <div style={{position:"absolute",inset:0,opacity:0.12,backgroundImage:bg(P.snow),backgroundSize:"100px 100px"}}/>
      <div style={{position:"absolute",inset:0,opacity:0.1,backgroundImage:bg(P.leaves),backgroundSize:"140px 140px"}}/>
      <div style={{animation:"fadeUp .9s ease both",textAlign:"center",zIndex:1}}>
        <div style={{width:86,height:86,borderRadius:24,margin:"0 auto 24px",background:"rgba(255,255,255,0.22)",border:"1.5px solid rgba(255,255,255,0.45)",display:"flex",alignItems:"center",justifyContent:"center",animation:"float 3s ease-in-out infinite",boxShadow:"0 8px 32px rgba(70,130,180,0.25)"}}>
          <svg width="46" height="46" viewBox="0 0 46 46" fill="none"><circle cx="23" cy="23" r="20" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" fill="none"/><path d="M23 8c-8 6-10 12-7 20 2 5 7 9 7 9s5-4 7-9c3-8 1-14-7-20Z" fill="rgba(255,255,255,0.7)"/></svg>
        </div>
        <div style={{color:"#fff",fontSize:36,fontFamily:display,fontWeight:700,letterSpacing:4}}>LIMPIDUS</div>
        <div style={{color:"rgba(255,255,255,0.7)",fontSize:13,marginTop:10,fontFamily:body,fontWeight:300}}>{lang==="fr"?"L'entretien de votre propriété, simplifié.":"Professional property maintenance, simplified."}</div>
      </div>
      <div style={{position:"absolute",bottom:60,animation:"fadeUp .8s .6s both",opacity:0,animationFillMode:"both"}}>
        <div style={{width:160,height:3,background:"rgba(255,255,255,0.2)",borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",borderRadius:99,background:"rgba(255,255,255,0.7)",animation:"barIn 2.3s .7s ease-out both"}}/></div>
      </div>
    </div>
  );

  // ────────────────────────────────────────────────────
  // AUTH
  // ────────────────────────────────────────────────────
  if(screen==="auth")return(
    <div style={{width:"100%",height:"100vh",display:"flex",flexDirection:"column",background:`linear-gradient(160deg,${C.skyBlue} 0%,${C.steelBlue} 100%)`,position:"relative",overflow:"hidden"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;700&display=swap');@keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}*{box-sizing:border-box;}button{cursor:pointer;border:none;background:transparent;}input{outline:none;}`}</style>
      <div style={{position:"absolute",inset:0,opacity:0.1,backgroundImage:bg(P.snow),backgroundSize:"90px 90px"}}/>
      {/* Lang */}
      <div style={{position:"absolute",top:18,right:18,display:"flex",gap:5,zIndex:10}}>
        {["fr","en"].map(l=><button key={l} onClick={()=>setLang(l)} style={{padding:"5px 13px",borderRadius:20,fontSize:11,fontFamily:body,fontWeight:700,background:lang===l?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.2)",color:lang===l?C.steelBlue:"rgba(255,255,255,0.85)",border:lang===l?"none":"1px solid rgba(255,255,255,0.3)"}}>{l.toUpperCase()}</button>)}
      </div>
      {/* Header */}
      <div style={{padding:"64px 32px 24px",textAlign:"center",animation:"slideUp .7s ease both"}}>
        <div style={{width:64,height:64,borderRadius:18,margin:"0 auto 18px",background:"rgba(255,255,255,0.2)",border:"1.5px solid rgba(255,255,255,0.45)",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <svg width="34" height="34" viewBox="0 0 46 46" fill="none"><circle cx="23" cy="23" r="20" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" fill="none"/><path d="M23 8c-8 6-10 12-7 20 2 5 7 9 7 9s5-4 7-9c3-8 1-14-7-20Z" fill="rgba(255,255,255,0.7)"/></svg>
        </div>
        <div style={{color:"#fff",fontSize:28,fontFamily:display,fontWeight:700,letterSpacing:3}}>LIMPIDUS</div>
        <div style={{color:"rgba(255,255,255,0.6)",fontSize:12,marginTop:6,fontFamily:body,fontWeight:300}}>{lang==="fr"?"L'entretien de votre propriété, simplifié.":"Professional property maintenance, simplified."}</div>
      </div>
      {/* Card */}
      <div style={{flex:1,background:C.cream,borderRadius:"28px 28px 0 0",padding:"24px 22px 36px",overflowY:"auto",animation:"slideUp .5s .15s ease both",boxShadow:"0 -8px 40px rgba(70,130,180,0.18)"}}>
        {/* Tabs */}
        <div style={{display:"flex",background:C.skyBluePale,borderRadius:12,padding:4,marginBottom:22}}>
          {[["login",lang==="fr"?"Connexion":"Sign In"],["register",lang==="fr"?"Créer un compte":"Create Account"]].map(([m,lbl])=>(
            <button key={m} onClick={()=>setAuthMode(m)} style={{flex:1,padding:"10px 0",borderRadius:9,fontSize:13,fontFamily:body,fontWeight:700,background:authMode===m?C.white:"transparent",color:authMode===m?C.steelBlue:C.mist,boxShadow:authMode===m?"0 2px 8px rgba(70,130,180,0.12)":"none",transition:"all 0.2s"}}>{lbl}</button>
          ))}
        </div>

        {/* Champs inscription */}
        {authMode==="register" && <>
          {[
            {label:lang==="fr"?"Nom et prénom":"Full Name", val:regName, set:setRegName, ph:lang==="fr"?"Votre nom complet":"Your full name", type:"text"},
            {label:lang==="fr"?"Numéro de téléphone":"Phone Number", val:regPhone, set:setRegPhone, ph:"+237 6XX XXX XXX", type:"tel", required:true},
          ].map((f,i)=>(
            <div key={i} style={{marginBottom:14}}>
              <div style={{fontSize:11,color:C.mist,fontFamily:body,fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>
                {f.label}{f.required&&<span style={{color:C.error,marginLeft:3}}>*</span>}
              </div>
              <input value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph} type={f.type}
                style={{width:"100%",border:`1.5px solid ${f.val?C.forestGreen:C.fog}`,borderRadius:10,padding:"13px 15px",fontSize:14,color:C.slate,fontFamily:body,background:C.cream}}/>
            </div>
          ))}
          {/* Note confidentialité téléphone */}
          <div style={{background:C.skyBluePale,border:`1.5px solid ${C.skyBlueMid}`,borderRadius:10,padding:"8px 13px",marginBottom:14,fontSize:11,color:C.steelBlue,fontFamily:body,lineHeight:1.5}}>
            {lang==="fr"
              ?"Votre numéro de téléphone est utilisé uniquement pour le paiement Mobile Money et est visible uniquement par le secrétariat."
              :"Your phone number is used only for Mobile Money payments and is visible only to the secretariat."}
          </div>
        </>}

        {[
          {label:lang==="fr"?"Adresse électronique":"Email Address",ph:lang==="fr"?"votre@email.com":"your@email.com",type:"email"},
          {label:lang==="fr"?"Mot de passe":"Password",ph:"••••••••",type:"password"},
        ].map((f,i)=>(
          <div key={i} style={{marginBottom:14}}>
            <div style={{fontSize:11,color:C.mist,fontFamily:body,fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>{f.label}</div>
            <div style={{border:`1.5px solid ${C.fog}`,borderRadius:10,padding:"13px 15px",fontSize:14,color:C.slate,fontFamily:body,background:C.cream}}>{f.ph}</div>
          </div>
        ))}

        <Btn onClick={()=>goLogin("client")} style={{width:"100%",marginTop:8,marginBottom:10,borderRadius:12,padding:"14px 0"}}>
          {authMode==="login"?(lang==="fr"?"Connexion client":"Client Login"):(lang==="fr"?"Créer mon compte":"Create My Account")}
        </Btn>
        <HR style={{margin:"16px 0"}}/>
        <div style={{display:"flex",gap:8,marginBottom:14}}>
          {[{r:"secretary",lbl:lang==="fr"?"Secrétariat":"Secretary",bg:C.greenPale,brd:C.greenMid,fg:C.forestGreen},{r:"admin",lbl:lang==="fr"?"Administration":"Admin",bg:C.skyBluePale,brd:C.skyBlueMid,fg:C.steelBlue}].map(p=>(
            <button key={p.r} onClick={()=>goLogin(p.r)} style={{flex:1,padding:"12px 0",borderRadius:10,border:`1.5px solid ${p.brd}`,background:p.bg,color:p.fg,fontSize:12,fontFamily:body,fontWeight:700,cursor:"pointer"}}>{p.lbl}</button>
          ))}
        </div>
        {[lang==="fr"?"Continuer avec Google":"Continue with Google",lang==="fr"?"Continuer avec Apple":"Continue with Apple"].map(lbl=>(
          <button key={lbl} style={{width:"100%",padding:"12px 0",borderRadius:10,marginBottom:9,border:`1.5px solid ${C.fog}`,background:C.white,fontSize:13,color:C.slate,fontFamily:body,fontWeight:500,cursor:"pointer"}}>{lbl}</button>
        ))}
        <div style={{marginTop:16,padding:"11px 15px",borderRadius:12,background:C.skyBluePale,border:`1.5px solid ${C.skyBlueMid}`,fontSize:12,color:C.steelBlue,fontFamily:body,lineHeight:1.6}}>
          {lang==="fr"?"La double authentification (2FA) est disponible dans vos paramètres de sécurité.":"Two-factor authentication (2FA) is available in your security settings."}
        </div>
      </div>
    </div>
  );

  // ════════════════════════════════════════════════════
  // APP
  // ════════════════════════════════════════════════════

  const renderContent=()=>{

    // Politique de confidentialité (sous-page)
    if(subPage==="privacy") return <PrivacyView lang={lang} onBack={()=>setSubPage(null)}/>;

    // Avis client
    if(tab==="review"&&reviewTarget){
      if(reviewSent)return(
        <div style={{padding:"0 20px 110px",textAlign:"center",paddingTop:60}}>
          <div style={{width:64,height:64,borderRadius:32,margin:"0 auto 20px",background:C.greenPale,border:`2px solid ${C.lightGreen}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,color:C.forestGreen}}>✓</div>
          <div style={{fontSize:24,color:C.forestGreen,fontFamily:display,fontWeight:700,marginBottom:10}}>{t("reviewThanks")}</div>
          <div style={{fontSize:13,color:C.mist,fontFamily:body,lineHeight:1.7,marginBottom:28}}>{lang==="fr"?"Votre avis sera examiné par notre équipe avant publication.":"Your review will be examined by our team before publication."}</div>
          <Btn onClick={()=>{setReviewTarget(null);setTab("planning");}} style={{padding:"12px 28px",width:"auto",display:"inline-block",borderRadius:20}}>{t("backToPlanning")}</Btn>
        </div>
      );
      return(
        <div style={{padding:"0 20px 110px"}}>
          <button onClick={()=>{setReviewTarget(null);setTab("planning");}} style={{fontSize:13,color:C.mist,fontFamily:body,marginBottom:20,display:"flex",alignItems:"center",gap:5}}>← {t("back")}</button>
          <div style={{fontSize:26,color:C.slate,fontFamily:display,fontWeight:700,marginBottom:4}}>{t("leaveReview")}</div>
          <div style={{fontSize:13,color:C.mist,fontFamily:body,marginBottom:24}}>{lang==="fr"?reviewTarget.service_fr:reviewTarget.service_en} · {reviewTarget.date}</div>
          {[{k:"overall",lbl:t("ratingLabel")},{k:"punctuality",lbl:t("punctuality")},{k:"quality",lbl:t("quality")},{k:"courtesy",lbl:t("courtesy")}].map(c=>(
            <div key={c.k} style={{marginBottom:20}}>
              <div style={{fontSize:12,color:C.mist,fontFamily:body,fontWeight:700,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.04em"}}>{c.lbl}</div>
              <Stars value={ratings[c.k]} onChange={v=>setRatings(p=>({...p,[c.k]:v}))} size={28}/>
            </div>
          ))}
          <HR style={{margin:"6px 0 20px"}}/>
          <div style={{fontSize:12,color:C.mist,fontFamily:body,fontWeight:700,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.04em"}}>{t("commentLabel")}</div>
          <textarea value={reviewText} onChange={e=>setReviewText(e.target.value)} placeholder={t("reviewPlaceholder")} rows={5}
            style={{width:"100%",border:`1.5px solid ${C.fog}`,borderRadius:12,padding:"13px 15px",fontSize:13,color:C.slate,fontFamily:body,background:C.cream,lineHeight:1.7}}/>
          <Btn onClick={submitReview} disabled={ratings.overall===0} style={{width:"100%",marginTop:16,borderRadius:12,padding:"14px 0"}}>{t("reviewSubmit")}</Btn>
        </div>
      );
    }

    // ── CLIENT HOME ──────────────────────────────────
    if(role==="client"&&tab==="home"){
      const next=bookings.find(b=>b.status==="confirmed"||b.status==="pending");
      return(
        <div style={{padding:"0 20px 110px"}}>
          <PCard pattern={P.leaves} style={{background:`linear-gradient(135deg,${C.skyBlue} 0%,${C.steelBlue} 100%)`,padding:"24px 22px",marginBottom:18,boxShadow:"0 4px 20px rgba(70,130,180,0.2)"}}>
            <div style={{color:"rgba(255,255,255,0.65)",fontSize:12,fontFamily:body,fontWeight:300}}>{lang==="fr"?"Bonjour":"Good day"}</div>
            <div style={{color:"#fff",fontSize:22,fontFamily:display,fontWeight:700,marginTop:4}}>M. Thomas Mbouassono</div>
            <div style={{display:"inline-block",marginTop:12,padding:"5px 14px",borderRadius:20,background:"rgba(255,255,255,0.2)",border:"1px solid rgba(255,255,255,0.35)",color:"rgba(255,255,255,0.9)",fontSize:12,fontFamily:body,fontWeight:700}}>
              {lang==="fr"?"Argent":"Silver"} — {loyaltyPts.toLocaleString()} {t("points")}
            </div>
          </PCard>

          {next&&(
            <div style={{background:C.white,borderRadius:16,padding:18,marginBottom:18,border:`1.5px solid ${C.skyBlueMid}`,boxShadow:"0 2px 12px rgba(135,206,235,0.18)"}}>
              <div style={{fontSize:11,color:C.mist,fontFamily:body,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:12}}>{t("nextIntervention")}</div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div>
                  <div style={{fontSize:17,color:C.slate,fontFamily:display,fontWeight:600,marginBottom:5}}>{lang==="fr"?next.service_fr:next.service_en}</div>
                  <div style={{fontSize:12,color:C.mist,fontFamily:body,marginBottom:2}}>{next.date} · {next.time}</div>
                  <div style={{fontSize:12,color:C.mist,fontFamily:body}}>{next.agent}</div>
                </div>
                <Badge status={next.status} lang={lang}/>
              </div>
              <div style={{display:"flex",gap:8,marginTop:14}}>
                <Btn onClick={()=>{}} style={{flex:1,borderRadius:10,padding:"10px 0",fontSize:13}}>{t("confirm")}</Btn>
                <Btn onClick={()=>{}} variant="ghost" style={{flex:1,borderRadius:10,padding:"10px 0",fontSize:13}}>{t("reschedule")}</Btn>
              </div>
            </div>
          )}

          <div style={{fontSize:11,color:C.mist,fontFamily:body,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:12}}>{t("quickActions")}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11,marginBottom:24}}>
            {[{fr:"Réserver un service",en:"Book a Service",dot:C.forestGreen,bg:C.greenPale,id:"services"},{fr:"Mon planning",en:"My Schedule",dot:C.steelBlue,bg:C.skyBluePale,id:"planning"},{fr:"Fidélité",en:"Loyalty",dot:C.forestGreen,bg:C.greenPale,id:"loyalty"},{fr:"Mon profil",en:"My Profile",dot:C.mist,bg:C.cloud,id:"profile"}].map(a=>(
              <button key={a.id} onClick={()=>setTab(a.id)} style={{padding:"18px 15px",borderRadius:14,background:a.bg,border:`1.5px solid ${a.dot}22`,textAlign:"left",transition:"all 0.18s",boxShadow:"0 2px 8px rgba(70,130,180,0.08)",cursor:"pointer"}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:a.dot,marginBottom:12}}/>
                <div style={{fontSize:14,color:C.slate,fontFamily:display,fontWeight:600}}>{lang==="fr"?a.fr:a.en}</div>
              </button>
            ))}
          </div>

          <div style={{fontSize:11,color:C.mist,fontFamily:body,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:12}}>{t("recentActivity")}</div>
          {bookings.map(b=>(
            <div key={b.id} style={{background:C.white,borderRadius:12,padding:"13px 16px",marginBottom:8,border:`1.5px solid ${C.fog}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:14,color:C.slate,fontFamily:display,fontWeight:600}}>{lang==="fr"?b.service_fr:b.service_en}</div>
                <div style={{fontSize:11,color:C.mist,fontFamily:body,marginTop:2}}>{b.date}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <Badge status={b.status} lang={lang}/>
                <div style={{fontSize:13,color:C.slate,fontFamily:body,fontWeight:700,marginTop:5}}>{(b.amount/1000).toFixed(0)} 000 F</div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // ── CLIENT SERVICES ──────────────────────────────
    if(role==="client"&&tab==="services"){
      const catPatterns={cleaning:P.clean,gardening:P.garden,hvac:P.snow};

      if(bookSvc){
        const steps=lang==="fr"?["Date","Créneau","Paiement"]:["Date","Time","Payment"];
        return(
          <div style={{padding:"0 20px 110px"}}>
            {showPayModal&&<PaymentModal service={bookSvc} lang={lang} onSuccess={()=>{setShowPayModal(false);setBookSvc(null);setBookStep(1);setTab("planning");}} onCancel={()=>setShowPayModal(false)}/>}

            <button onClick={()=>{setBookSvc(null);setBookStep(1);}} style={{fontSize:13,color:C.mist,fontFamily:body,marginBottom:18,display:"flex",alignItems:"center",gap:6}}>← {t("backToServices")}</button>
            <PCard pattern={bookSvc.cat==="cleaning"?P.clean:bookSvc.cat==="gardening"?P.garden:P.snow} style={{
              background:bookSvc.cat==="cleaning"?`linear-gradient(135deg,${C.skyBluePale},${C.skyBlueMid})`:bookSvc.cat==="gardening"?`linear-gradient(135deg,${C.greenPale},${C.greenMid})`:`linear-gradient(135deg,${C.skyBluePale},${C.steelLight})`,
              padding:"20px",marginBottom:22,borderRadius:16,
            }}>
              <div style={{fontSize:22,color:C.slate,fontFamily:display,fontWeight:700,marginBottom:4}}>{lang==="fr"?bookSvc.name_fr:bookSvc.name_en}</div>
              <div style={{fontSize:13,color:C.mist,fontFamily:body}}>{lang==="fr"?bookSvc.desc_fr:bookSvc.desc_en} · {bookSvc.duration}</div>
            </PCard>

            {/* Étapes */}
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:24}}>
              {steps.map((s,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{width:26,height:26,borderRadius:13,fontSize:12,fontFamily:body,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",background:bookStep>=i+1?C.forestGreen:C.fog,color:bookStep>=i+1?"#fff":C.mist}}>{i+1}</div>
                  <div style={{fontSize:11,color:bookStep>=i+1?C.slate:C.mist,fontFamily:body,fontWeight:600}}>{s}</div>
                  {i<steps.length-1&&<div style={{width:16,height:2,background:C.fog,borderRadius:1}}/>}
                </div>
              ))}
            </div>

            {bookStep===1&&(
              <div>
                <div style={{fontSize:11,color:C.mist,fontFamily:body,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:10}}>{t("selectDate")}</div>
                <div style={{background:C.white,border:`1.5px solid ${C.fog}`,borderRadius:14,padding:18,marginBottom:18}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                    <div style={{fontSize:17,color:C.slate,fontFamily:display,fontWeight:600}}>Avril 2025</div>
                    <div style={{display:"flex",gap:8}}>
                      <button style={{color:C.mist,fontSize:18,fontFamily:body,cursor:"pointer"}}>‹</button>
                      <button style={{color:C.mist,fontSize:18,fontFamily:body,cursor:"pointer"}}>›</button>
                    </div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,textAlign:"center"}}>
                    {(lang==="fr"?["L","M","M","J","V","S","D"]:["M","T","W","T","F","S","S"]).map((d,i)=><div key={i} style={{fontSize:10,color:C.mist,fontFamily:body,fontWeight:700,paddingBottom:7,textTransform:"uppercase"}}>{d}</div>)}
                    {Array.from({length:30},(_,i)=>i+1).map(d=>{const sel=d===7;return<div key={d} style={{height:32,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:8,fontSize:13,fontFamily:body,background:sel?C.forestGreen:"transparent",color:sel?"#fff":C.slate,cursor:"pointer",fontWeight:sel?700:400}}>{d}</div>;})}
                  </div>
                </div>
                <Btn onClick={()=>setBookStep(2)} style={{width:"100%",borderRadius:12,padding:"14px 0"}}>{t("continue_")}</Btn>
              </div>
            )}

            {bookStep===2&&(
              <div>
                <div style={{fontSize:11,color:C.mist,fontFamily:body,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:10}}>{t("selectTime")}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:22}}>
                  {["08h00","09h00","10h00","11h00","14h00","15h00","16h00","17h00"].map(sl=>(
                    <button key={sl} onClick={()=>setBookSlot(sl)} style={{padding:"13px 0",borderRadius:10,fontSize:15,fontFamily:body,fontWeight:600,color:C.slate,border:`2px solid ${sl===bookSlot?C.forestGreen:C.fog}`,background:sl===bookSlot?C.greenPale:C.white,cursor:"pointer",transition:"all 0.15s"}}>{sl}</button>
                  ))}
                </div>
                <Btn onClick={()=>setBookStep(3)} style={{width:"100%",borderRadius:12,padding:"14px 0"}}>{t("continue_")}</Btn>
              </div>
            )}

            {bookStep===3&&(
              <div>
                <div style={{background:C.greenPale,border:`1.5px solid ${C.greenMid}`,borderRadius:14,padding:18,marginBottom:18}}>
                  <div style={{fontSize:11,color:C.forestGreen,fontFamily:body,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:12}}>{t("summaryLabel")}</div>
                  {[{l:lang==="fr"?"Service":"Service",v:lang==="fr"?bookSvc.name_fr:bookSvc.name_en},{l:lang==="fr"?"Date":"Date",v:"Lundi 7 avril 2025"},{l:lang==="fr"?"Heure":"Time",v:bookSlot},{l:lang==="fr"?"Durée":"Duration",v:bookSvc.duration},{l:lang==="fr"?"Montant":"Amount",v:`${(bookSvc.price/1000).toFixed(0)} 000 FCFA`}].map((r,i)=><FRow key={i} label={r.l} value={r.v}/>)}
                </div>

                {/* Paiement Mobile Money uniquement */}
                <div style={{fontSize:11,color:C.mist,fontFamily:body,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:10}}>{t("paymentMethod")}</div>
                <div style={{background:C.greenPale,border:`1.5px solid ${C.greenMid}`,borderRadius:12,padding:"14px 16px",marginBottom:16,fontSize:12,color:C.forestGreen,fontFamily:body,lineHeight:1.6}}>
                  {lang==="fr"
                    ?"Paiement exclusivement digital — Orange Money ou MTN Mobile Money. Le paiement garantit votre réservation."
                    :"Digital payment only — Orange Money or MTN Mobile Money. Payment guarantees your booking."}
                </div>
                <div style={{display:"flex",gap:10,marginBottom:18}}>
                  {[{id:"orange",logo:"🟠",name:"Orange Money",color:C.orange},{id:"mtn",logo:"🟡",name:"MTN MoMo",color:C.mtn}].map(op=>(
                    <div key={op.id} style={{flex:1,padding:"14px 10px",borderRadius:12,textAlign:"center",border:`2px solid ${C.fog}`,background:C.cream,opacity:0.7}}>
                      <div style={{fontSize:22}}>{op.logo}</div>
                      <div style={{fontSize:11,color:C.slate,fontFamily:body,fontWeight:700,marginTop:4}}>{op.name}</div>
                    </div>
                  ))}
                </div>
                <Btn onClick={()=>setShowPayModal(true)} variant="orange" style={{width:"100%",borderRadius:12,padding:"15px 0",fontSize:14}}>
                  {lang==="fr"?"Procéder au paiement Mobile Money":"Proceed with Mobile Money Payment"}
                </Btn>
              </div>
            )}
          </div>
        );
      }

      // Liste services
      const cats=[{id:"all",fr:"Tous",en:"All"},{id:"cleaning",fr:"Nettoyage",en:"Cleaning"},{id:"gardening",fr:"Jardinage",en:"Gardening"},{id:"hvac",fr:"Climatisation",en:"HVAC"}];
      const filtered=catFilter==="all"?SERVICES:SERVICES.filter(s=>s.cat===catFilter);
      return(
        <div style={{padding:"0 20px 110px"}}>
          <div style={{fontSize:26,color:C.slate,fontFamily:display,fontWeight:700,marginBottom:4}}>{lang==="fr"?"Nos prestations":"Our Services"}</div>
          <div style={{fontSize:13,color:C.mist,fontFamily:body,marginBottom:18}}>{lang==="fr"?"Choisissez votre prestation":"Choose your service"}</div>
          <div style={{display:"flex",gap:7,overflowX:"auto",paddingBottom:4,marginBottom:18}}>
            {cats.map(c=>(
              <button key={c.id} onClick={()=>setCatFilter(c.id)} style={{flexShrink:0,padding:"8px 16px",borderRadius:20,fontSize:12,fontFamily:body,fontWeight:700,background:catFilter===c.id?C.forestGreen:C.white,color:catFilter===c.id?"#fff":C.mist,border:`1.5px solid ${catFilter===c.id?C.forestGreen:C.fog}`,cursor:"pointer",transition:"all 0.15s"}}>{lang==="fr"?c.fr:c.en}</button>
            ))}
          </div>
          {filtered.map(s=>(
            <PCard key={s.id} pattern={catPatterns[s.cat]||P.clean} style={{background:C.white,marginBottom:12,border:`1.5px solid ${C.fog}`,boxShadow:"0 2px 10px rgba(135,206,235,0.12)"}}>
              <div style={{padding:18}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <div style={{flex:1,paddingRight:12}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                      <div style={{fontSize:16,color:C.slate,fontFamily:display,fontWeight:600}}>{lang==="fr"?s.name_fr:s.name_en}</div>
                      {s.badge==="new"&&<span style={{padding:"2px 8px",borderRadius:10,fontSize:10,fontFamily:body,fontWeight:700,background:`${C.forestGreen}15`,color:C.forestGreen}}>{lang==="fr"?"Nouveau":"New"}</span>}
                      {s.badge==="exceptional"&&<span style={{padding:"2px 8px",borderRadius:10,fontSize:10,fontFamily:body,fontWeight:700,background:`${C.orange}15`,color:C.orange}}>{lang==="fr"?"Exceptionnel":"Exceptional"}</span>}
                    </div>
                    <div style={{fontSize:12,color:C.mist,fontFamily:body,lineHeight:1.5}}>{lang==="fr"?s.desc_fr:s.desc_en}</div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontSize:20,color:C.forestGreen,fontFamily:display,fontWeight:700}}>{(s.price/1000).toFixed(0)} 000</div>
                    <div style={{fontSize:10,color:C.mist,fontFamily:body,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em"}}>FCFA</div>
                  </div>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:12,borderTop:`1px solid ${C.fog}`}}>
                  <span style={{fontSize:12,color:C.mist,fontFamily:body}}>{s.duration} · {t("availableLabel")}</span>
                  <Btn onClick={()=>{setBookSvc(s);setBookStep(1);}} style={{padding:"9px 20px",width:"auto",borderRadius:20,fontSize:13}}>{t("book")}</Btn>
                </div>
              </div>
            </PCard>
          ))}
        </div>
      );
    }

    // ── CLIENT PLANNING ──────────────────────────────
    if(role==="client"&&tab==="planning")return(
      <div style={{padding:"0 20px 110px"}}>
        <div style={{fontSize:26,color:C.slate,fontFamily:display,fontWeight:700,marginBottom:4}}>{lang==="fr"?"Planning":"Planning"}</div>
        <div style={{fontSize:13,color:C.mist,fontFamily:body,marginBottom:20}}>{lang==="fr"?"Vos interventions planifiées":"Your scheduled interventions"}</div>
        {bookings.map(b=>(
          <div key={b.id} style={{background:C.white,borderRadius:14,padding:"17px 17px",marginBottom:11,border:`1.5px solid ${C.fog}`,boxShadow:"0 2px 8px rgba(135,206,235,0.1)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div>
                <div style={{fontSize:10,color:C.mist,fontFamily:body,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:4}}>{b.id}</div>
                <div style={{fontSize:16,color:C.slate,fontFamily:display,fontWeight:600}}>{lang==="fr"?b.service_fr:b.service_en}</div>
                <div style={{fontSize:12,color:C.mist,fontFamily:body,marginTop:3}}>{b.date} · {b.time} · {b.agent}</div>
              </div>
              <Badge status={b.status} lang={lang}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:11,borderTop:`1px solid ${C.fog}`}}>
              <div style={{fontSize:15,color:C.slate,fontFamily:body,fontWeight:700}}>{(b.amount/1000).toFixed(0)} 000 FCFA</div>
              <div style={{display:"flex",gap:7}}>
                {(b.status==="confirmed"||b.status==="pending")&&<Btn onClick={()=>{}} variant="ghost" style={{padding:"7px 14px",width:"auto",borderRadius:8,fontSize:12}}>{t("reschedule")}</Btn>}
                {b.status==="completed"&&!b.reviewed&&<Btn onClick={()=>openReview(b)} style={{padding:"7px 14px",width:"auto",borderRadius:8,fontSize:12}}>{t("leaveReview")}</Btn>}
                {b.status==="completed"&&b.reviewed&&<span style={{fontSize:11,color:C.forestGreen,fontFamily:body,fontWeight:700}}>{t("reviewPosted")}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    );

    // ── CLIENT FIDÉLITÉ ──────────────────────────────
    if(role==="client"&&tab==="loyalty"){
      const levels=[{id:"bronze",fr:"Bronze",en:"Bronze",min:0,max:999},{id:"silver",fr:"Argent",en:"Silver",min:1000,max:2499},{id:"gold",fr:"Or",en:"Gold",min:2500,max:4999},{id:"platinum",fr:"Platine",en:"Platinum",min:5000,max:9999}];
      const cur=levels.find(l=>loyaltyPts>=l.min&&loyaltyPts<=l.max)||levels[1];
      const nxt=levels[levels.indexOf(cur)+1];
      const prog=nxt?((loyaltyPts-cur.min)/(nxt.min-cur.min))*100:100;
      return(
        <div style={{padding:"0 20px 110px"}}>
          <div style={{fontSize:26,color:C.slate,fontFamily:display,fontWeight:700,marginBottom:18}}>{t("loyaltyTitle")}</div>
          <PCard pattern={P.leaves} style={{background:`linear-gradient(135deg,${C.forestGreen} 0%,#1B6E1B 100%)`,padding:"24px 22px",marginBottom:18,boxShadow:"0 4px 20px rgba(34,139,34,0.25)"}}>
            <div style={{color:"rgba(255,255,255,0.55)",fontSize:11,fontFamily:body,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em"}}>{lang==="fr"?"Solde de points":"Points Balance"}</div>
            <div style={{color:"#fff",fontSize:48,fontFamily:display,fontWeight:700,lineHeight:1.05,marginTop:4}}>{loyaltyPts.toLocaleString()}</div>
            <div style={{color:"rgba(255,255,255,0.6)",fontSize:14,fontFamily:body,marginBottom:16}}>{t("points")}</div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <span style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontFamily:body,fontWeight:700,textTransform:"uppercase"}}>{lang==="fr"?cur.fr:cur.en}</span>
              {nxt&&<span style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontFamily:body}}>{lang==="fr"?nxt.fr:nxt.en} — {nxt.min.toLocaleString()} pts</span>}
            </div>
            <div style={{height:6,background:"rgba(255,255,255,0.2)",borderRadius:99}}><div style={{height:"100%",borderRadius:99,width:`${Math.min(prog,100)}%`,background:"rgba(255,255,255,0.7)"}}/></div>
          </PCard>
          {/* Roue */}
          <div style={{background:C.white,borderRadius:16,padding:"22px 18px",marginBottom:18,border:`1.5px solid ${C.fog}`,textAlign:"center"}}>
            <div style={{fontSize:20,color:C.slate,fontFamily:display,fontWeight:700,marginBottom:4}}>{t("spinWheel")}</div>
            <div style={{fontSize:12,color:C.mist,fontFamily:body,marginBottom:22}}>{t("spinInfo")}</div>
            <div style={{position:"relative",display:"inline-block",marginBottom:22}}>
              <div style={{position:"absolute",top:-11,left:"50%",transform:"translateX(-50%)",width:0,height:0,borderLeft:"10px solid transparent",borderRight:"10px solid transparent",borderTop:`20px solid ${C.forestGreen}`,zIndex:2}}/>
              <svg width="200" height="200" viewBox="0 0 200 200" style={{display:"block",transform:`rotate(${wAngle}deg)`,transition:wSpin?"transform 3.6s cubic-bezier(.15,.85,.15,1)":"none",filter:"drop-shadow(0 6px 20px rgba(34,139,34,0.2))"}}>
                {WHEEL_COLORS.map((color,i)=>{const a1=(i*60-90)*Math.PI/180,a2=((i+1)*60-90)*Math.PI/180,r=96,x1=100+r*Math.cos(a1),y1=100+r*Math.sin(a1),x2=100+r*Math.cos(a2),y2=100+r*Math.sin(a2),mx=100+62*Math.cos((a1+a2)/2),my=100+62*Math.sin((a1+a2)/2);return(<g key={i}><path d={`M100,100 L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`} fill={color} stroke="#fff" strokeWidth="2"/><text x={mx} y={my} textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.9)" fontSize="9" fontFamily={body} fontWeight="700">{["15%","×2","Gratuit","+500","10%","Cadeau"][i]}</text></g>);})}
                <circle cx="100" cy="100" r="16" fill={C.cream} stroke={C.forestGreen} strokeWidth="2.5"/><circle cx="100" cy="100" r="7" fill={C.forestGreen}/>
              </svg>
            </div>
            {wPrize&&<div style={{padding:"14px 20px",borderRadius:14,marginBottom:16,background:C.greenPale,border:`1.5px solid ${C.lightGreen}`}}><div style={{fontSize:12,color:C.forestGreen,fontFamily:body,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.04em",marginBottom:4}}>{t("congratulations")}</div><div style={{fontSize:16,color:C.forestGreen,fontFamily:display,fontWeight:700}}>{t("youWon")} : {lang==="fr"?wPrize.fr:wPrize.en}</div></div>}
            <Btn onClick={spinWheel} disabled={wSpin||loyaltyPts<1000} style={{padding:"12px 32px",width:"auto",borderRadius:20}}>{wSpin?t("spinning"):t("spinWheel")}</Btn>
          </div>
          <div style={{background:C.white,borderRadius:16,padding:18,border:`1.5px solid ${C.fog}`}}>
            <div style={{fontSize:13,color:C.slate,fontFamily:display,fontWeight:700,marginBottom:14}}>{t("levels")}</div>
            {levels.map((l,i)=>(
              <div key={l.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<levels.length-1?`1px solid ${C.fog}`:"none"}}>
                <div style={{width:10,height:10,borderRadius:"50%",flexShrink:0,background:loyaltyPts>=l.min?C.forestGreen:C.fog}}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:15,color:C.slate,fontFamily:display,fontWeight:600}}>{lang==="fr"?l.fr:l.en}</div>
                  <div style={{fontSize:12,color:C.mist,fontFamily:body}}>{l.min.toLocaleString()} — {l.max.toLocaleString()} {t("points")}</div>
                </div>
                {loyaltyPts>=l.min&&<span style={{fontSize:11,color:C.forestGreen,fontFamily:body,fontWeight:700}}>{lang==="fr"?"Atteint":"Reached"}</span>}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // ── CLIENT PROFIL ────────────────────────────────
    if(role==="client"&&tab==="profile")return(
      <div style={{padding:"0 20px 110px"}}>
        <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:26}}>
          <div style={{width:64,height:64,borderRadius:32,background:`linear-gradient(135deg,${C.skyBlue},${C.steelBlue})`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:20,fontFamily:display,fontWeight:700,flexShrink:0,boxShadow:"0 4px 16px rgba(70,130,180,0.3)"}}>TM</div>
          <div>
            <div style={{fontSize:22,color:C.slate,fontFamily:display,fontWeight:700}}>Thomas Mbouassono</div>
            <div style={{fontSize:12,color:C.mist,fontFamily:body,fontWeight:700,marginTop:2}}>{lang==="fr"?"Argent":"Silver"} — 2 450 {t("points")}</div>
          </div>
        </div>
        <PCard pattern={P.snow} style={{background:`linear-gradient(135deg,${C.skyBlue},${C.steelBlue})`,padding:22,marginBottom:24,textAlign:"center",boxShadow:"0 4px 20px rgba(70,130,180,0.22)"}}>
          <div style={{color:"rgba(255,255,255,0.5)",fontSize:11,fontFamily:body,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:14}}>{t("qrDisplay")}</div>
          <div style={{width:88,height:88,background:C.white,borderRadius:12,margin:"0 auto 14px",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(0,0,0,0.12)"}}>
            <svg width="56" height="56" viewBox="0 0 56 56"><rect x="2" y="2" width="20" height="20" rx="3" fill={C.slate}/><rect x="34" y="2" width="20" height="20" rx="3" fill={C.slate}/><rect x="2" y="34" width="20" height="20" rx="3" fill={C.slate}/><rect x="6" y="6" width="12" height="12" rx="2" fill={C.white}/><rect x="38" y="6" width="12" height="12" rx="2" fill={C.white}/><rect x="6" y="38" width="12" height="12" rx="2" fill={C.white}/><rect x="10" y="10" width="4" height="4" rx="1" fill={C.slate}/><rect x="42" y="10" width="4" height="4" rx="1" fill={C.slate}/><rect x="10" y="42" width="4" height="4" rx="1" fill={C.slate}/><rect x="34" y="34" width="5" height="5" rx="1" fill={C.slate}/><rect x="41" y="34" width="5" height="5" rx="1" fill={C.slate}/><rect x="47" y="34" width="5" height="5" rx="1" fill={C.slate}/></svg>
          </div>
          <div style={{color:"#fff",fontSize:16,fontFamily:display,fontWeight:700,letterSpacing:3}}>LMP-2025-00847</div>
        </PCard>
        {[{lbl:t("language"),val:lang==="fr"?"Français":"English",fn:()=>setLang(lang==="fr"?"en":"fr")},{lbl:t("twoFA"),val:lang==="fr"?"Activée":"Enabled",fn:()=>{}},{lbl:t("privacy"),val:"›",fn:()=>setSubPage("privacy")},{lbl:t("deleteAccount"),val:"›",fn:()=>{},danger:true}].map((it,i)=>(
          <button key={i} onClick={it.fn} style={{width:"100%",background:C.white,border:`1.5px solid ${C.fog}`,borderRadius:12,padding:"14px 16px",marginBottom:7,display:"flex",justifyContent:"space-between",alignItems:"center",textAlign:"left",boxShadow:"0 1px 4px rgba(135,206,235,0.08)",cursor:"pointer"}}>
            <span style={{fontSize:14,color:it.danger?C.error:C.slate,fontFamily:body,fontWeight:500}}>{it.lbl}</span>
            <span style={{fontSize:13,color:C.mist,fontFamily:body}}>{it.val}</span>
          </button>
        ))}
        <Btn onClick={()=>setScreen("auth")} variant="danger" style={{width:"100%",marginTop:14,borderRadius:12,padding:"13px 0"}}>{t("logout")}</Btn>
      </div>
    );

    // ── SECRÉTAIRE AVIS ──────────────────────────────
    if(role==="secretary"&&tab==="reviews")return(
      <div style={{padding:"0 20px 110px"}}>
        <div style={{fontSize:26,color:C.slate,fontFamily:display,fontWeight:700,marginBottom:4}}>{t("pendingReviews")}</div>
        <div style={{fontSize:13,color:C.mist,fontFamily:body,marginBottom:20}}>{modReviews.length} {lang==="fr"?"avis en attente de modération":"reviews pending moderation"}</div>
        {modReviews.length===0&&<div style={{textAlign:"center",paddingTop:48,fontSize:14,color:C.mist,fontFamily:body}}>{t("noReviewsPending")}</div>}
        {modReviews.map(rv=>(
          <div key={rv.id} style={{background:C.white,borderRadius:14,padding:18,marginBottom:13,border:`1.5px solid ${C.fog}`,boxShadow:"0 2px 8px rgba(135,206,235,0.1)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div>
                <div style={{fontSize:15,color:C.slate,fontFamily:display,fontWeight:700,marginBottom:2}}>{rv.client}</div>
                <div style={{fontSize:11,color:C.mist,fontFamily:body,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.04em"}}>{rv.ref} · {lang==="fr"?rv.service_fr:rv.service_en}</div>
                <div style={{fontSize:11,color:C.mist,fontFamily:body,marginTop:2}}>{rv.date}</div>
              </div>
              <Badge status="pending" lang={lang}/>
            </div>
            <Stars value={rv.rating} size={18}/>
            <div style={{marginTop:11,padding:"12px 14px",borderRadius:10,background:C.cloud,fontSize:13,color:C.slate,fontFamily:body,lineHeight:1.7,fontStyle:"italic"}}>« {rv.content} »</div>
            <div style={{display:"flex",gap:8,marginTop:13}}>
              <Btn onClick={()=>setModReviews(p=>p.filter(r=>r.id!==rv.id))} style={{flex:1,borderRadius:10,padding:"10px 0",fontSize:13}}>{t("approveReview")}</Btn>
              <Btn onClick={()=>setModReviews(p=>p.filter(r=>r.id!==rv.id))} variant="danger" style={{flex:1,borderRadius:10,padding:"10px 0",fontSize:13}}>{t("rejectReview")}</Btn>
            </div>
          </div>
        ))}
      </div>
    );

    // ── SECRÉTAIRE RELANCES ──────────────────────────
    if(role==="secretary"&&tab==="followup")return(
      <div style={{padding:"0 20px 110px"}}>
        <div style={{fontSize:26,color:C.slate,fontFamily:display,fontWeight:700,marginBottom:4}}>{t("clientFollowUp")}</div>
        <div style={{fontSize:13,color:C.mist,fontFamily:body,marginBottom:20}}>{FOLLOWUPS.length} {lang==="fr"?"clients à relancer":"clients to follow up"}</div>
        {FOLLOWUPS.map(fu=>(
          <div key={fu.id} style={{background:C.white,borderRadius:14,padding:18,marginBottom:12,border:`1.5px solid ${fu.urgency==="urgent"?"#FFCDD2":C.fog}`,borderLeft:`4px solid ${fu.urgency==="urgent"?C.error:fu.urgency==="normal"?C.warning:C.forestGreen}`,boxShadow:"0 2px 8px rgba(135,206,235,0.08)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div>
                <div style={{fontSize:15,color:C.slate,fontFamily:display,fontWeight:700,marginBottom:2}}>{fu.client}</div>
                {/* Numéro visible secrétariat uniquement */}
                <div style={{fontSize:12,color:C.steelBlue,fontFamily:body,fontWeight:700}}>{fu.phone}</div>
              </div>
              <Badge status={fu.urgency} lang={lang}/>
            </div>
            <FRow label={lang==="fr"?"Dernier service":"Last service"} value={lang==="fr"?fu.lastSvc_fr:fu.lastSvc_en}/>
            <FRow label={lang==="fr"?"Date":"Date"} value={fu.lastDate}/>
            <FRow label={lang==="fr"?"Motif":"Reason"} value={lang==="fr"?fu.reason_fr:fu.reason_en}/>
            <FRow label={t("lastContact")} value={fu.lastContact}/>
            <div style={{display:"flex",gap:8,marginTop:13,paddingTop:11,borderTop:`1px solid ${C.fog}`}}>
              <Btn onClick={()=>{}} variant="blue" style={{flex:2,borderRadius:10,padding:"10px 0",fontSize:13}}>{t("sendFollowUp")}</Btn>
              <Btn onClick={()=>{}} variant="ghost" style={{flex:1,borderRadius:10,padding:"10px 0",fontSize:13}}>{t("contactClient")}</Btn>
            </div>
          </div>
        ))}
      </div>
    );

    // ── SECRÉTAIRE CALENDRIER ────────────────────────
    if(role==="secretary"&&tab==="calendar")return(
      <div style={{padding:"0 20px 110px"}}>
        <PCard pattern={P.leaves} style={{background:`linear-gradient(135deg,${C.steelBlue},#2a5a9a)`,padding:"18px 20px",marginBottom:20,boxShadow:"0 4px 16px rgba(70,130,180,0.2)"}}>
          <div style={{fontSize:20,color:"#fff",fontFamily:display,fontWeight:700,marginBottom:3}}>{t("calendarTitle")}</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.65)",fontFamily:body}}>{t("calendarSub")}</div>
        </PCard>
        <SecretaryCalendar lang={lang}/>
      </div>
    );

    // SECRÉTAIRE Clients
    if(role==="secretary"&&tab==="clients")return(
      <div style={{padding:"0 20px 110px"}}>
        <div style={{fontSize:26,color:C.slate,fontFamily:display,fontWeight:700,marginBottom:20}}>{lang==="fr"?"Clients":"Clients"}</div>
        {BOOKINGS_0.map(b=>(
          <div key={b.id} style={{background:C.white,borderRadius:12,padding:"14px 16px",marginBottom:8,border:`1.5px solid ${C.fog}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:14,color:C.slate,fontFamily:display,fontWeight:600}}>{lang==="fr"?b.service_fr:b.service_en}</div>
              <div style={{fontSize:11,color:C.mist,fontFamily:body,marginTop:2}}>{b.date} · {b.time} · {b.agent}</div>
            </div>
            <Badge status={b.status} lang={lang}/>
          </div>
        ))}
      </div>
    );

    // ── ADMIN DASHBOARD ──────────────────────────────
    if(role==="admin"&&tab==="dashboard")return(
      <div style={{padding:"0 20px 110px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11,marginBottom:18}}>
          {[{fr:"Chiffre d'affaires",en:"Revenue",val:"3,2 M FCFA",trend:"+8 %",bg:C.greenPale,accent:C.forestGreen},{fr:"Clients actifs",en:"Active Clients",val:"184",trend:"+12",bg:C.skyBluePale,accent:C.steelBlue},{fr:"Interventions/jour",en:"Jobs/day",val:"12",trend:"",bg:C.greenPale,accent:C.forestGreen},{fr:"Satisfaction",en:"Satisfaction",val:"4,8 / 5",trend:"",bg:C.skyBluePale,accent:C.steelBlue}].map((k,i)=>(
            <div key={i} style={{background:k.bg,borderRadius:14,padding:16,border:`1.5px solid ${k.accent}22`,boxShadow:"0 2px 8px rgba(135,206,235,0.1)"}}>
              <div style={{fontSize:10,color:C.mist,fontFamily:body,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:8}}>{lang==="fr"?k.fr:k.en}</div>
              <div style={{fontSize:22,color:k.accent,fontFamily:display,fontWeight:700}}>{k.val}</div>
              {k.trend&&<div style={{fontSize:12,color:C.forestGreen,fontFamily:body,fontWeight:700,marginTop:4}}>{k.trend}</div>}
            </div>
          ))}
        </div>
        <div style={{background:C.white,borderRadius:16,padding:18,marginBottom:18,border:`1.5px solid ${C.fog}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
            <div style={{fontSize:16,color:C.slate,fontFamily:display,fontWeight:700}}>{t("cashFlow")}</div>
            <div style={{display:"flex",gap:5}}>
              {["monthly","yearly"].map(v=><button key={v} onClick={()=>setRevView(v)} style={{padding:"5px 12px",borderRadius:20,fontSize:11,fontFamily:body,fontWeight:700,background:revView===v?C.steelBlue:C.skyBluePale,color:revView===v?"#fff":C.mist,border:`1.5px solid ${revView===v?C.steelBlue:C.fog}`,cursor:"pointer"}}>{t(v)}</button>)}
            </div>
          </div>
          <div style={{display:"flex",alignItems:"flex-end",gap:11,height:100}}>
            {REVENUE.map((d,i)=>{const mx=Math.max(...REVENUE.map(x=>x.proj));return(<div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}><div style={{width:"100%",display:"flex",gap:3,alignItems:"flex-end"}}><div style={{flex:1,borderRadius:"4px 4px 0 0",height:`${(d.proj/mx)*80}px`,background:C.greenMid}}/><div style={{flex:1,borderRadius:"4px 4px 0 0",height:`${(d.conf/mx)*80}px`,background:C.forestGreen}}/></div><div style={{fontSize:10,color:C.mist,fontFamily:body,fontWeight:700,textTransform:"uppercase"}}>{d.m}</div></div>);})}
          </div>
          <div style={{display:"flex",gap:16,marginTop:12}}>
            {[{c:C.forestGreen,l:t("confirmedRev")},{c:C.greenMid,l:t("projectedRev")}].map((lg,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:10,height:10,borderRadius:3,background:lg.c}}/><span style={{fontSize:11,color:C.mist,fontFamily:body}}>{lg.l}</span></div>
            ))}
          </div>
        </div>
        <div style={{background:C.white,borderRadius:16,padding:18,border:`1.5px solid ${C.fog}`}}>
          <div style={{fontSize:16,color:C.slate,fontFamily:display,fontWeight:700,marginBottom:14}}>{t("agentStatus")}</div>
          {AGENTS.map((a,i)=>(
            <div key={a.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<AGENTS.length-1?`1px solid ${C.fog}`:"none"}}>
              <div style={{width:36,height:36,borderRadius:18,flexShrink:0,background:`linear-gradient(135deg,${C.skyBluePale},${C.skyBlueMid})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:C.steelBlue,fontFamily:display,fontWeight:700}}>{a.name.split(" ").map(n=>n[0]).slice(0,2).join("")}</div>
              <div style={{flex:1,minWidth:0}}><div style={{fontSize:14,color:C.slate,fontFamily:display,fontWeight:600}}>{a.name}</div><div style={{fontSize:11,color:C.mist,fontFamily:body}}>{a.zone} · {a.rating}/5</div></div>
              <Badge status={a.status} lang={lang}/>
            </div>
          ))}
        </div>
      </div>
    );

    // ── ADMIN ÉQUIPES ────────────────────────────────
    if(role==="admin"&&tab==="team")return(
      <div style={{padding:"0 20px 110px"}}>
        <div style={{fontSize:26,color:C.slate,fontFamily:display,fontWeight:700,marginBottom:18}}>{t("teamManagement")}</div>
        <PCard pattern={P.garden} style={{background:`linear-gradient(135deg,${C.skyBluePale},${C.skyBlueMid})`,height:160,marginBottom:18,border:`1.5px solid ${C.skyBlueMid}`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
          <div style={{textAlign:"center",position:"relative",zIndex:1}}>
            <div style={{fontSize:14,color:C.steelBlue,fontFamily:display,fontWeight:700}}>{lang==="fr"?"Carte des interventions":"Interventions Map"}</div>
            <div style={{fontSize:11,color:C.mist,fontFamily:body,marginTop:4}}>Google Maps API · {AGENTS.length} {lang==="fr"?"agents actifs":"active agents"}</div>
          </div>
          {AGENTS.map((a,i)=><div key={i} style={{position:"absolute",top:`${20+i*18}%`,left:`${14+i*18}%`,width:28,height:28,borderRadius:14,background:C.steelBlue,border:"2.5px solid #fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#fff",fontFamily:body,fontWeight:700,boxShadow:"0 3px 8px rgba(70,130,180,0.3)",zIndex:2}}>{a.name.charAt(0)}</div>)}
        </PCard>
        {AGENTS.map(a=>(
          <div key={a.id} style={{background:C.white,borderRadius:14,padding:17,marginBottom:11,border:`1.5px solid ${C.fog}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:11}}>
              <div style={{display:"flex",gap:12,alignItems:"center"}}>
                <div style={{width:44,height:44,borderRadius:22,flexShrink:0,background:`linear-gradient(135deg,${C.skyBluePale},${C.skyBlueMid})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,color:C.steelBlue,fontFamily:display,fontWeight:700}}>{a.name.split(" ").map(n=>n[0]).slice(0,2).join("")}</div>
                <div><div style={{fontSize:15,color:C.slate,fontFamily:display,fontWeight:700}}>{a.name}</div><div style={{fontSize:12,color:C.mist,fontFamily:body,marginTop:2}}>{a.zone} · {a.rating}/5</div></div>
              </div>
              <Badge status={a.status} lang={lang}/>
            </div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:12}}>{(lang==="fr"?a.skills_fr:a.skills_en).map(s=><span key={s} style={{padding:"3px 11px",borderRadius:20,fontSize:11,fontFamily:body,fontWeight:700,background:C.greenPale,color:C.forestGreen}}>{s}</span>)}</div>
            <div style={{display:"flex",gap:8}}>
              <Btn onClick={()=>{}} style={{flex:1,borderRadius:10,padding:"9px 0",fontSize:13}}>{t("assign")}</Btn>
              <Btn onClick={()=>{}} variant="ghost" style={{flex:1,borderRadius:10,padding:"9px 0",fontSize:13}}>{t("checkIn")}</Btn>
            </div>
          </div>
        ))}
      </div>
    );

    // ── ADMIN FINANCES ───────────────────────────────
    if(role==="admin"&&tab==="finance")return(
      <div style={{padding:"0 20px 110px"}}>
        <div style={{fontSize:26,color:C.slate,fontFamily:display,fontWeight:700,marginBottom:18}}>{lang==="fr"?"Finances":"Finance"}</div>
        <div style={{background:C.greenPale,border:`1.5px solid ${C.greenMid}`,borderRadius:12,padding:"12px 16px",marginBottom:18,fontSize:12,color:C.forestGreen,fontFamily:body,lineHeight:1.7}}>{t("paymentNote")}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:18}}>
          {[{fr:"Revenus",en:"Revenue",val:"3,2 M",c:C.forestGreen,bg:C.greenPale},{fr:"Charges",en:"Expenses",val:"1,8 M",c:C.error,bg:"#FFF0EE"},{fr:"Bénéfice",en:"Profit",val:"1,4 M",c:C.steelBlue,bg:C.skyBluePale}].map((k,i)=>(
            <div key={i} style={{background:k.bg,borderRadius:12,padding:14,border:`1.5px solid ${k.c}22`,textAlign:"center"}}>
              <div style={{fontSize:18,color:k.c,fontFamily:display,fontWeight:700}}>{k.val}</div>
              <div style={{fontSize:10,color:C.mist,fontFamily:body,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.04em",marginTop:4}}>{lang==="fr"?k.fr:k.en}</div>
            </div>
          ))}
        </div>
        <div style={{background:C.white,borderRadius:16,padding:18,border:`1.5px solid ${C.fog}`}}>
          <div style={{fontSize:16,color:C.slate,fontFamily:display,fontWeight:700,marginBottom:14}}>{t("byService")}</div>
          {[{fr:"Nettoyage",en:"Cleaning",pct:45,val:"1 440 000",c:C.steelBlue},{fr:"Jardinage",en:"Gardening",pct:30,val:"960 000",c:C.forestGreen},{fr:"Climatisation",en:"HVAC",pct:25,val:"800 000",c:C.skyBlue}].map((s,i)=>(
            <div key={i} style={{marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:13,color:C.slate,fontFamily:body,fontWeight:600}}>{lang==="fr"?s.fr:s.en}</span><span style={{fontSize:13,color:C.slate,fontFamily:body,fontWeight:700}}>{s.val} FCFA</span></div>
              <div style={{height:8,background:C.cloud,borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",borderRadius:99,width:`${s.pct}%`,background:s.c,transition:"width 0.6s ease"}}/></div>
            </div>
          ))}
        </div>
      </div>
    );

    // ── ADMIN/SECRÉTAIRE SETTINGS ────────────────────
    if(tab==="settings")return(
      <div style={{padding:"0 20px 110px"}}>
        <div style={{fontSize:26,color:C.slate,fontFamily:display,fontWeight:700,marginBottom:22}}>{lang==="fr"?"Paramètres":"Settings"}</div>
        {[{lbl:t("language"),val:lang==="fr"?"Français":"English",fn:()=>setLang(lang==="fr"?"en":"fr")},{lbl:t("twoFA"),val:lang==="fr"?"Activée":"Enabled",fn:()=>{}},{lbl:t("roles"),val:"›",fn:()=>{}},{lbl:t("auditLog"),val:"›",fn:()=>{}},{lbl:t("accountingExport"),val:"CSV / Excel",fn:()=>{}}].map((it,i)=>(
          <button key={i} onClick={it.fn} style={{width:"100%",background:C.white,border:`1.5px solid ${C.fog}`,borderRadius:12,padding:"14px 16px",marginBottom:7,display:"flex",justifyContent:"space-between",alignItems:"center",textAlign:"left",cursor:"pointer"}}>
            <span style={{fontSize:14,color:C.slate,fontFamily:body,fontWeight:500}}>{it.lbl}</span>
            <span style={{fontSize:13,color:C.mist,fontFamily:body}}>{it.val}</span>
          </button>
        ))}
        <Btn onClick={()=>setScreen("auth")} variant="danger" style={{width:"100%",marginTop:14,borderRadius:12,padding:"13px 0"}}>{t("logout")}</Btn>
      </div>
    );

    return null;
  };

  // ── SHELL ─────────────────────────────────────────
  return(
    <div style={{width:"100%",height:"100vh",display:"flex",flexDirection:"column",background:C.cream,maxWidth:480,margin:"0 auto",position:"relative",overflow:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;700&display=swap');
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        *{box-sizing:border-box;margin:0;padding:0;}
        button{cursor:pointer;border:none;background:transparent;font-family:inherit;}
        textarea{font-family:inherit;outline:none;resize:none;}
        input{outline:none;}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-thumb{background:${C.skyBlueMid};border-radius:4px;}
      `}</style>

      {/* ── BANNIÈRE PUB (haut) ── */}
      <AdBanner lang={lang}/>

      {/* ── HEADER ── */}
      <div style={{padding:"10px 18px 12px",background:C.white,borderBottom:`1px solid ${C.fog}`,display:"flex",justifyContent:"space-between",alignItems:"center",boxShadow:"0 2px 12px rgba(135,206,235,0.1)",position:"relative",overflow:"hidden",flexShrink:0}}>
        <div style={{position:"absolute",right:0,top:0,bottom:0,width:100,opacity:0.07,backgroundImage:bg(P.leaves),backgroundSize:"100px 100px",backgroundRepeat:"repeat",pointerEvents:"none"}}/>
        <div style={{position:"relative",zIndex:1}}>
          <div style={{fontSize:8,color:C.mist,fontFamily:body,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:2}}>
            LIMPIDUS · {(role==="admin"?(lang==="fr"?"Administration":"Administration"):role==="secretary"?(lang==="fr"?"Secrétariat":"Secretary"):(lang==="fr"?"Espace client":"Client Portal")).toUpperCase()}
          </div>
          <div style={{fontSize:19,color:C.slate,fontFamily:display,fontWeight:700}}>{pageTitle()}</div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center",position:"relative",zIndex:1}}>
          <button onClick={()=>setLang(lang==="fr"?"en":"fr")} style={{padding:"5px 12px",borderRadius:20,fontSize:11,fontFamily:body,fontWeight:700,border:`1.5px solid ${C.fog}`,color:C.mist,background:C.cream,cursor:"pointer"}}>{lang.toUpperCase()}</button>
          <div style={{position:"relative"}}>
            <div style={{width:34,height:34,borderRadius:10,background:C.skyBluePale,border:`1.5px solid ${C.skyBlueMid}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:C.steelBlue}}>◻</div>
            <div style={{position:"absolute",top:-3,right:-3,width:15,height:15,borderRadius:8,background:C.error,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"#fff",fontFamily:body,fontWeight:700,border:`2px solid ${C.cream}`}}>3</div>
          </div>
        </div>
      </div>

      {/* ── CONTENU ── */}
      <div style={{flex:1,overflowY:"auto",paddingTop:16,animation:"fadeIn .24s ease"}}>
        {renderContent()}
      </div>

      {/* ── NAV BAS ── */}
      {tab!=="review"&&!subPage&&(
        <div style={{position:"relative",background:C.white,borderTop:`1px solid ${C.fog}`,display:"flex",padding:"8px 4px 20px",boxShadow:"0 -4px 16px rgba(135,206,235,0.12)",flexShrink:0}}>
          {(NAV[role]||NAV.client).map(nt=>{
            const active=nt.id===activeId;
            return(
              <button key={nt.id} onClick={()=>{setSubPage(null);setTab(nt.id);}} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"4px 0",cursor:"pointer"}}>
                <div style={{width:32,height:32,borderRadius:10,background:active?C.greenPale:"transparent",border:active?`1.5px solid ${C.lightGreen}`:"1.5px solid transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:active?C.forestGreen:C.mist,transition:"all 0.18s"}}>
                  {navIcon(nt.id)}
                </div>
                <div style={{fontSize:9,fontFamily:body,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.04em",color:active?C.forestGreen:C.mist}}>{lang==="fr"?nt.fr:nt.en}</div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
