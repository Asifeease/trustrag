/**
 * Comprehensive Indian Legal Knowledge Base for TrustRAG
 * Covers Criminal (IPC/BNS), Civil (NI Act, CPC, Contracts), Corporate (Companies Act, IBC),
 * Constitutional Law, Family Law, Cyber Law (IT Act), and Consumer Protection.
 */

export const legalStatutes = [
  {
    id: "stat-ni-138",
    category: "Civil Law",
    act: "Negotiable Instruments Act, 1881",
    section: "Section 138",
    title: "Dishonour of cheque for insufficiency, etc., of funds in the account",
    keywords: ["cheque", "dishonour", "bounce", "insufficient funds", "138", "ni act", "bank notice"],
    summary: "Deals with the criminal liability for dishonour of cheques due to insufficient funds or exceeding arranged limits.",
    details: "Under Section 138 of the Negotiable Instruments Act, 1881, if a cheque is dishonoured due to insufficient funds or exceeding credit limits, the drawer commits an offence.\n\nKey Requirements:\n1. The cheque must be presented within its validity period (3 months).\n2. Payee must issue a formal legal demand notice within 30 days of receiving the cheque return memo.\n3. The drawer is given 15 days from receipt of notice to make payment.\n4. If payment is not made within 15 days, a criminal complaint can be filed before the Judicial Magistrate within 1 month.",
    punishment: "Imprisonment for up to 2 years, or fine up to twice the amount of the cheque, or both.",
    tag: "Primary Source",
    icon: "doc"
  },
  {
    id: "stat-ni-139",
    category: "Civil Law",
    act: "Negotiable Instruments Act, 1881",
    section: "Section 139",
    title: "Presumption in favour of holder",
    keywords: ["cheque", "presumption", "debt", "liability", "139", "burden of proof"],
    summary: "Statutory presumption that the holder of a cheque received it for the discharge of a debt or other liability.",
    details: "Section 139 creates a statutory presumption that unless the contrary is proved, the holder received the cheque for discharging a legally enforceable debt or liability. The initial burden is on the accused drawer to rebut this presumption through preponderance of probabilities.",
    punishment: "Rebuttable legal presumption shifting burden of proof to drawer.",
    tag: "Primary Source",
    icon: "doc"
  },
  {
    id: "stat-crpc-154",
    category: "Criminal Law",
    act: "Code of Criminal Procedure, 1973 (CrPC) / BNSS 2023 Sec 173",
    section: "Section 154 CrPC",
    title: "Information in cognizable cases (First Information Report - FIR)",
    keywords: ["fir", "police", "complaint", "cognizable", "zero fir", "police station", "154 crpc"],
    summary: "Mandatory registration of an FIR upon receiving information relating to a cognizable offence.",
    details: "Section 154 CrPC provides the procedure for recording an FIR in cognizable offences. When information disclosing a cognizable offence is given orally or in writing to an officer in charge of a police station, it must be reduced to writing and signed by the informant. A copy must be provided free of cost to the complainant immediately. Zero FIR allows any police station to register the complaint irrespective of territorial jurisdiction.",
    punishment: "Failure of police officer to record FIR in specified offences attracts criminal penalties under Sec 166A IPC.",
    tag: "Primary Source",
    icon: "doc"
  },
  {
    id: "stat-crpc-125",
    category: "Family Law",
    act: "Code of Criminal Procedure, 1973 (CrPC) / BNSS 2023 Sec 144",
    section: "Section 125 CrPC",
    title: "Order for maintenance of wives, children and parents",
    keywords: ["maintenance", "wife", "alimony", "child support", "divorce", "125 crpc", "interim maintenance"],
    summary: "Secures monthly maintenance for wives, minor children, and dependent parents unable to maintain themselves.",
    details: "Section 125 provides a speedy and summary remedy for neglected wives, legitimate/illegitimate minor children, and infirm parents. A Magistrate of the first class may order a person having sufficient means to pay a monthly allowance for the maintenance of his wife, child, or parents if neglected. Interim maintenance applications must ordinarily be disposed of within 60 days.",
    punishment: "Warrant for levying fines or imprisonment up to 1 month for each month of default if payment is unpaid without sufficient cause.",
    tag: "Primary Source",
    icon: "doc"
  },
  {
    id: "stat-ipc-420",
    category: "Criminal Law",
    act: "Indian Penal Code, 1860 (IPC) / BNS 2023 Sec 318(4)",
    section: "Section 420 IPC",
    title: "Cheating and dishonestly inducing delivery of property",
    keywords: ["cheating", "fraud", "scam", "420", "deception", "property theft", "financial fraud"],
    summary: "Penalizes cheating and dishonestly inducing any person to deliver property or make/alter valuable security.",
    details: "Whoever cheats and thereby dishonestly induces the deceived person to deliver any property, or to make, alter or destroy the whole or any part of a valuable security, is liable under Section 420 IPC. The essential ingredients are fraudulent/dishonest intention from the inception of the transaction.",
    punishment: "Imprisonment of either description for a term extending up to 7 years, and shall also be liable to fine.",
    tag: "Primary Source",
    icon: "doc"
  },
  {
    id: "stat-crpc-437-439",
    category: "Criminal Law",
    act: "Code of Criminal Procedure, 1973 (CrPC)",
    section: "Sections 437, 438, 439 CrPC",
    title: "Bail and Anticipatory Bail Provisions",
    keywords: ["bail", "anticipatory bail", "regular bail", "arrest", "438", "439", "custody"],
    summary: "Governs grant of regular bail, bail in non-bailable offences, and anticipatory bail in anticipation of arrest.",
    details: "• Section 437: Power of Magistrates to grant bail in non-bailable offences.\n• Section 438: Anticipatory Bail granted by High Court or Court of Session when a person apprehends arrest in a non-bailable offence.\n• Section 439: Special powers of High Court or Sessions Court regarding bail and setting aside bail conditions.",
    punishment: "Procedural remedy guaranteeing personal liberty subject to bail conditions.",
    tag: "Primary Source",
    icon: "doc"
  },
  {
    id: "stat-const-21",
    category: "Constitutional Law",
    act: "Constitution of India",
    section: "Article 21",
    title: "Protection of Life and Personal Liberty",
    keywords: ["fundamental rights", "article 21", "liberty", "privacy", "right to life", "constitution"],
    summary: "No person shall be deprived of his life or personal liberty except according to procedure established by law.",
    details: "Article 21 is the cornerstone of Indian constitutional jurisprudence. Expanded via Supreme Court precedents to encompass the Right to Privacy (Puttaswamy case), Right to Speedy Trial, Right to Legal Aid, Right to Clean Environment, and Dignified Life. Any state procedure depriving liberty must be 'just, fair, and reasonable' (Maneka Gandhi case).",
    punishment: "Constitutional guarantee enforceable via Writ Petitions under Article 32 (Supreme Court) & Article 226 (High Courts).",
    tag: "Primary Source",
    icon: "doc"
  },
  {
    id: "stat-const-32-226",
    category: "Constitutional Law",
    act: "Constitution of India",
    section: "Articles 32 & 226",
    title: "Remedies for enforcement of Fundamental Rights (Writ Jurisdiction)",
    keywords: ["writ", "habeas corpus", "mandamus", "quowarranto", "certiorari", "prohibition", "article 32", "article 226"],
    summary: "Power of Supreme Court and High Courts to issue prerogative writs for enforcement of rights.",
    details: "Article 32 allows citizens to approach the Supreme Court directly for fundamental rights violations (described by Dr. Ambedkar as the 'heart and soul of the Constitution'). Article 226 empowers High Courts to issue writs (Habeas Corpus, Mandamus, Prohibition, Quo Warranto, Certiorari) for fundamental rights and any other legal rights.",
    punishment: "Judicial orders, quashing of illegal actions, compensation, or directives to authorities.",
    tag: "Primary Source",
    icon: "doc"
  },
  {
    id: "stat-it-66d",
    category: "Cyber Law",
    act: "Information Technology Act, 2000",
    section: "Section 66D",
    title: "Punishment for cheating by personation by using computer resource",
    keywords: ["cyber crime", "phishing", "online scam", "identity theft", "cyber fraud", "it act", "66d"],
    summary: "Punishes cheating by impersonation using computers, mobile phones, or communication devices.",
    details: "Whoever, by means for any communication device or computer resource cheats by personation (e.g. fake banking calls, phishing, WhatsApp fraud, spoofed emails), shall be punished under Section 66D of the IT Act.",
    punishment: "Imprisonment of either description for a term up to 3 years and fine up to ₹1,00,000.",
    tag: "Primary Source",
    icon: "doc"
  },
  {
    id: "stat-hma-13",
    category: "Family Law",
    act: "Hindu Marriage Act, 1955",
    section: "Section 13 & 13B",
    title: "Divorce and Mutual Consent Divorce",
    keywords: ["divorce", "mutual consent", "cruelty", "adultery", "desertion", "13b", "hindu marriage act"],
    summary: "Provides grounds for contested divorce (Section 13) and divorce by mutual consent (Section 13B).",
    details: "• Section 13 grounds: Cruelty, desertion (2+ years), adultery, conversion, unsoundness of mind, communicable disease.\n• Section 13B (Mutual Consent): Both spouses jointly petition the Family Court after living separately for at least 1 year, stating they cannot live together. A 6-month statutory cooling-off period can be waived under conditions laid down in Amardeep Singh v. Harveen Kaur.",
    punishment: "Decree of dissolution of marriage and permanent alimony/custody determinations.",
    tag: "Primary Source",
    icon: "doc"
  },
  {
    id: "stat-copra-2019",
    category: "Civil Law",
    act: "Consumer Protection Act, 2019",
    section: "Sections 34, 35, 47 & 58",
    title: "Consumer Dispute Redressal Commissions (District, State & National)",
    keywords: ["consumer", "deficiency of service", "refund", "unfair trade practice", "copra", "district commission"],
    summary: "Provides a 3-tier consumer redressal mechanism against defective goods, deficiency in service, and unfair trade practices.",
    details: "Consumers can file complaints for defective goods or deficient services before:\n1. District Consumer Commission: Claims up to ₹50 Lakhs (revised).\n2. State Commission: Claims between ₹50 Lakhs and ₹2 Crores.\n3. National Commission (NCDRC): Claims exceeding ₹2 Crores.\nComplaints can be filed online through the e-Daakhil portal.",
    punishment: "Directives to replace goods, refund money with interest, award compensation for harassment, and punitive damages.",
    tag: "Primary Source",
    icon: "doc"
  },
  {
    id: "stat-ca-135",
    category: "Corporate Law",
    act: "Companies Act, 2013",
    section: "Section 135",
    title: "Corporate Social Responsibility (CSR)",
    keywords: ["corporate", "csr", "companies act", "board of directors", "net worth", "turnover"],
    summary: "Mandates qualifying companies to spend at least 2% of their average net profits on CSR activities.",
    details: "Every company having net worth of ₹500 crore or more, or turnover of ₹1,000 crore or more, or net profit of ₹5 crore or more during the immediately preceding financial year must constitute a CSR Committee and spend at least 2% of average net profits of past 3 years on Schedule VII activities.",
    punishment: "Company liable to fine up to twice the unspent amount or ₹1 Crore; defaulting officers liable to penalty up to ₹2 Lakhs.",
    tag: "Primary Source",
    icon: "doc"
  }
];

export const landmarkCaseLaws = [
  {
    id: "case-bhaskaran",
    caseName: "K. Bhaskaran vs Sankaran Vaidhyan Balan",
    citation: "AIR 1999 SC 1860 / (1999) 7 SCC 510",
    court: "Supreme Court of India",
    bench: "K.T. Thomas & M.B. Shah, JJ.",
    category: "Civil Law",
    topics: ["cheque", "dishonour", "138", "jurisdiction", "notice"],
    significance: "Established that offence under Sec 138 NI Act can be tried at any place where: (1) cheque was drawn, (2) presented, (3) returned unpaid, (4) notice was given, or (5) payment was to be made.",
    icon: "book",
    tag: "Case Law"
  },
  {
    id: "case-dashrath",
    caseName: "Dashrath Rupsingh Rathod vs State of Maharashtra",
    citation: "(2014) 9 SCC 129 (Clarified by 2015 NI Amendment)",
    court: "Supreme Court of India",
    bench: "3-Judge Bench",
    category: "Civil Law",
    topics: ["cheque", "jurisdiction", "bank branch", "138 ni act"],
    significance: "Led to the 2015 Amendment in Section 142(2) NI Act, specifying that cheque bounce cases must be filed where the payee bank maintains the account (if delivered for collection) or where drawer maintains account.",
    icon: "book",
    tag: "Case Law"
  },
  {
    id: "case-arnesh",
    caseName: "Arnesh Kumar vs State of Bihar",
    citation: "(2014) 8 SCC 273",
    court: "Supreme Court of India",
    bench: "Chandramauli Kr. Prasad & Pinaki Chandra Ghose, JJ.",
    category: "Criminal Law",
    topics: ["arrest", "498a", "41 crpc", "bail", "police notice"],
    significance: "Mandated that police cannot automatically arrest accused in offences punishable with imprisonment up to 7 years without issuing Section 41A CrPC notice and recording valid reasons in writing.",
    icon: "book",
    tag: "Case Law"
  },
  {
    id: "case-dkbasu",
    caseName: "D.K. Basu vs State of West Bengal",
    citation: "AIR 1997 SC 610 / (1997) 1 SCC 416",
    court: "Supreme Court of India",
    bench: "Kuldip Singh & Dr. A.S. Anand, JJ.",
    category: "Criminal Law",
    topics: ["arrest", "custodial violence", "guidelines", "rights of accused", "fir"],
    significance: "Laid down 11 mandatory guidelines for police during arrest and detention to prevent custodial torture, including right to inform relative, memo of arrest, and medical examination.",
    icon: "book",
    tag: "Case Law"
  },
  {
    id: "case-maneka",
    caseName: "Maneka Gandhi vs Union of India",
    citation: "AIR 1978 SC 597 / (1978) 1 SCC 248",
    court: "Supreme Court of India",
    bench: "7-Judge Constitution Bench",
    category: "Constitutional Law",
    topics: ["article 21", "personal liberty", "procedure established by law", "due process"],
    significance: "Transformed Article 21 by holding that 'procedure established by law' must be just, fair, and reasonable, incorporating the American concept of procedural and substantive Due Process of Law.",
    icon: "book",
    tag: "Case Law"
  },
  {
    id: "case-puttaswamy",
    caseName: "Justice K.S. Puttaswamy (Retd.) vs Union of India",
    citation: "(2017) 10 SCC 1",
    court: "Supreme Court of India",
    bench: "9-Judge Constitution Bench",
    category: "Constitutional Law",
    topics: ["privacy", "aadhaar", "article 21", "fundamental right", "data protection"],
    significance: "Unanimously held that the Right to Privacy is a Fundamental Right intrinsically guaranteed under Article 21 and Part III of the Constitution.",
    icon: "book",
    tag: "Case Law"
  },
  {
    id: "case-rajnesh",
    caseName: "Rajnesh vs Neha",
    citation: "(2021) 2 SCC 324",
    court: "Supreme Court of India",
    bench: "Indu Malhotra & R. Subhash Reddy, JJ.",
    category: "Family Law",
    topics: ["maintenance", "125 crpc", "affidavit of assets", "interim maintenance", "wife"],
    significance: "Established comprehensive guidelines for granting maintenance in matrimonial matters, making filing of an Affidavit of Assets and Liabilities mandatory for both parties.",
    icon: "book",
    tag: "Case Law"
  },
  {
    id: "case-lalita-kumari",
    caseName: "Lalita Kumari vs Govt. of Uttar Pradesh",
    citation: "(2014) 2 SCC 1",
    court: "Supreme Court of India",
    bench: "5-Judge Constitution Bench",
    category: "Criminal Law",
    topics: ["fir", "mandatory registration", "154 crpc", "police", "preliminary inquiry"],
    significance: "Held that registration of FIR is mandatory under Section 154 CrPC if the information discloses commission of a cognizable offence, leaving no discretion to the police officer.",
    icon: "book",
    tag: "Case Law"
  }
];

export const sampleSuggestions = [
  "Cheque bounce notice period?",
  "Maintenance rights of wife?",
  "FIR vs Complaint?",
  "Anticipatory bail process?",
  "Arrest guidelines (D.K. Basu)?",
  "Mutual consent divorce rules?"
];

export const legalCategories = [
  { id: "criminal", name: "Criminal Law", icon: "⚖️", acts: ["IPC / BNS", "CrPC / BNSS", "Indian Evidence Act / BSA", "NDPS Act", "POCSO Act"] },
  { id: "civil", name: "Civil Law", icon: "📋", acts: ["Negotiable Instruments Act", "Code of Civil Procedure", "Indian Contract Act", "Consumer Protection Act"] },
  { id: "corporate", name: "Corporate Law", icon: "🏢", acts: ["Companies Act, 2013", "Insolvency and Bankruptcy Code (IBC)", "SEBI Regulations", "Arbitration Act"] },
  { id: "constitutional", name: "Constitutional Law", icon: "📜", acts: ["Constitution of India (Articles 14, 19, 21, 32, 226)", "Writ Jurisdiction", "Judicial Review"] },
  { id: "family", name: "Family Law", icon: "👨‍👩‍👧", acts: ["Hindu Marriage Act, 1955", "Special Marriage Act, 1954", "Sec 125 CrPC Maintenance", "Domestic Violence Act"] },
  { id: "cyber", name: "Cyber & Tech Law", icon: "💻", acts: ["Information Technology Act, 2000", "Digital Personal Data Protection Act, 2023"] }
];
