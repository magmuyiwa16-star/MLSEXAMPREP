export interface VivaFollowUp {
  question: string;
  idealAnswer: string;
}

export interface VivaQuestion {
  id: string;
  subject: string;
  question: string;
  idealAnswer: string;
  keyPoints: string[];
  followUps: [VivaFollowUp, VivaFollowUp, VivaFollowUp];
}

export const vivaBank: VivaQuestion[] = [
  {
    id: "v001",
    subject: "Haematology",
    question: "What is the pathophysiology of sickle cell disease?",
    idealAnswer: "Sickle cell disease results from a point mutation (glutamic acid → valine) at position 6 of the beta-globin chain, producing HbS. Under deoxygenation, HbS polymerises forming rigid tactoids that distort RBCs into sickle shape, causing vascular occlusion, haemolysis, and end-organ damage.",
    keyPoints: ["Point mutation in beta-globin gene (GAG→GTG)", "HbS polymerisation under hypoxia", "Vaso-occlusion and haemolytic anaemia", "Painful crises, stroke, organ infarction"],
    followUps: [
      { question: "How does hydroxyurea help in sickle cell disease?", idealAnswer: "Hydroxyurea increases HbF (foetal haemoglobin) synthesis by stimulating γ-globin gene expression. HbF dilutes HbS and inhibits its polymerisation, reducing sickling frequency and severity of painful crises." },
      { question: "What laboratory findings would you expect in a sickle cell crisis?", idealAnswer: "During crisis: elevated WCC (neutrophilia), reticulocytosis (haemolytic compensation), elevated LDH and indirect bilirubin (haemolysis markers), low haemoglobin (baseline 6–8 g/dL), elevated CRP. Sickle cells visible on blood film." },
      { question: "What is the basis of the sickling test and what does it demonstrate?", idealAnswer: "Sodium metabisulphite (2%) deoxygenates blood; HbS-containing cells sickle under light microscopy. Detects HbS presence but cannot distinguish SS disease from AS trait. HPLC or electrophoresis is needed for definitive characterisation." }
    ]
  },
  {
    id: "v002",
    subject: "Chemical Pathology",
    question: "Explain the biochemical basis of jaundice and how you would classify it.",
    idealAnswer: "Jaundice is yellowish discolouration from bilirubin accumulation (>35 µmol/L). Bilirubin derives from haem catabolism (unconjugated/indirect) and is conjugated in hepatocytes to glucuronides (direct/conjugated). Classified as: pre-hepatic (haemolysis), hepatic (hepatocellular damage), and post-hepatic (obstructive/cholestatic).",
    keyPoints: ["Bilirubin metabolism: unconjugated → hepatocyte conjugation → bile excretion", "Pre-hepatic: elevated unconjugated, urobilinogen in urine", "Hepatic: mixed pattern, elevated ALT/AST", "Post-hepatic: conjugated bilirubin, elevated ALP/GGT, pale stools, dark urine"],
    followUps: [
      { question: "How do you distinguish pre-hepatic from hepatic jaundice biochemically?", idealAnswer: "Pre-hepatic: predominantly unconjugated (indirect) bilirubin elevated, normal ALP/ALT, elevated urobilinogen in urine, no bilirubinuria. Hepatic: mixed bilirubin elevation, markedly elevated ALT/AST, possible bilirubinuria, variable ALP." },
      { question: "What is the significance of urobilinogen in urine?", idealAnswer: "Conjugated bilirubin excreted into bile is converted by gut bacteria to urobilinogen; most is reabsorbed (enterohepatic circulation) and excreted in urine in small amounts. Absence (pale stools, no urobilinogen) = complete biliary obstruction. Excess = haemolysis or hepatic disease." },
      { question: "What additional tests would help determine the cause of obstructive jaundice?", idealAnswer: "Ultrasound/CT to identify biliary duct dilation, gallstones, pancreatic mass. LFTs: markedly elevated ALP, GGT, conjugated bilirubin. ERCP or MRCP for detailed biliary imaging. CA19-9 if pancreatic cancer suspected. Viral hepatitis serology if infectious cause." }
    ]
  },
  {
    id: "v003",
    subject: "Medical Microbiology",
    question: "Describe how you would investigate a suspected urinary tract infection in the laboratory.",
    idealAnswer: "Receive MSU (mid-stream urine) collected aseptically. Macroscopic inspection (turbidity, colour). Dipstick for leucocyte esterase, nitrite, protein. Microscopy (≥10 WBC/mm³ = pyuria; bacteria). Culture on CLED and blood agar (>10⁵ CFU/mL = significant bacteriuria). Sensitivity testing by disc diffusion (CLSI criteria). Report organism and sensitivities.",
    keyPoints: ["Proper specimen collection (MSU)", "Dipstick screening", "Microscopy for pyuria and bacteriuria", "Quantitative culture (>10⁵ CFU/mL significant)", "Identification and antibiotic sensitivity testing"],
    followUps: [
      { question: "What is CLED agar and why is it used for urine cultures?", idealAnswer: "Cystine Lactose Electrolyte Deficient (CLED) agar prevents swarming of Proteus species, supports growth of all urinary pathogens, and differentiates lactose fermenters (yellow colonies) from non-fermenters (pale/colourless). Electrolyte deficiency prevents Proteus swarming." },
      { question: "How would you interpret a urine culture growing mixed organisms?", idealAnswer: "≥3 organisms with no predominant growth usually indicates contamination — request repeat properly collected MSU. Two organisms may be significant in catheterised patients. Single organism >10⁵ CFU/mL from properly collected MSU is significant." },
      { question: "What pathogens cause UTI in hospitalised patients and how do they differ from community-acquired UTIs?", idealAnswer: "Hospital-acquired (nosocomial) UTI: Klebsiella, Pseudomonas, Enterococcus, Candida, ESBL-producing E. coli. Often involve catheterisation. More resistant organisms. Community UTI: E. coli (80%), S. saprophyticus (young women), Klebsiella, Proteus. Generally more susceptible to standard antibiotics." }
    ]
  },
  {
    id: "v004",
    subject: "Blood Group Serology",
    question: "Explain the ABO blood grouping system and the expected serological reactions for each group.",
    idealAnswer: "ABO system: A and B antigens (carbohydrate) on RBCs; corresponding antibodies (anti-A, anti-B) naturally occurring IgM in serum from around 6 months of age. Group A: A antigen + anti-B; Group B: B antigen + anti-A; Group AB: A and B + no antibodies; Group O: neither antigen + anti-A and anti-B. Forward grouping tests cells; reverse tests serum. Must agree.",
    keyPoints: ["Landsteiner's law: naturally occurring antibodies against absent antigens", "Forward (cell) grouping vs reverse (serum) grouping", "Four major groups: A, B, AB, O", "IgM antibodies; react at room temperature"],
    followUps: [
      { question: "What is a discrepancy between forward and reverse ABO grouping and how would you investigate it?", idealAnswer: "ABO discrepancy: forward and reverse grouping results disagree. Causes: weak antigens (A subgroups, elderly, disease), extra antigens (chimaerism), missing antibodies (immunodeficiency, newborns), acquired B, autoantibodies. Investigate with additional cells/antibodies, enzyme treatment, adsorption-elution, molecular typing." },
      { question: "Why can't we give group O positive blood to all patients without testing?", idealAnswer: "While Group O lacks A/B antigens, it may still be Rh(D) positive. Rh(D) negative patients could be sensitised to D antigen → anti-D formation → future haemolytic transfusion reaction or HDN. O negative is the true universal donor. Also, O blood contains high-titre anti-A/B which can cause haemolysis." },
      { question: "What is a haemolytic transfusion reaction and how is it investigated?", idealAnswer: "HTR: destruction of transfused RBCs by recipient's antibodies (or vice versa). Acute (<24h): ABO, Kidd; Delayed (>24h, days): Kidd, Rh, Duffy. Investigation: stop transfusion, repeat crossmatch, DAT on post-transfusion sample, repeat ABO/Rh, antibody screen, blood culture, urinalysis, LDH, bilirubin, haptoglobin." }
    ]
  },
  {
    id: "v005",
    subject: "Histopathology",
    question: "Describe the process of routine histological tissue processing from biopsy to stained section.",
    idealAnswer: "Tissue fixation (10% NBF, 6–24h) → Grossing/dissection → Tissue processing (automated: dehydration with alcohols, clearing with xylene, impregnation with paraffin wax) → Embedding (orient tissue in paraffin block) → Microtomy (3–5µm sections with rotary microtome) → Mounting on slides → Dewaxing/rehydration → Staining (H&E) → Coverslipping → Reporting.",
    keyPoints: ["Fixation with NBF prevents autolysis", "Processing: dehydration → clearing → wax impregnation", "Microtomy: 3–5 µm sections", "H&E staining protocol", "Quality control at each step"],
    followUps: [
      { question: "What are the consequences of inadequate fixation on histological sections?", idealAnswer: "Poor fixation: autolysis and putrefaction continue → cell morphology distorted, nuclear detail lost, chromatin poorly defined, cytoplasm vacuolated, poor IHC antigen retrieval. Tissue may be uninterpretable. Inadequate fixation volume (≥10x tissue volume of formalin required)." },
      { question: "How does the microtome produce thin sections and what are common artefacts?", idealAnswer: "Rotary microtome: specimen block advances via calibrated mechanism; sharp microtome knife cuts sections. Common artefacts: knife marks (chatter lines from nicks in blade), compression (too fast sectioning), floatation artefacts (wrinkles from water bath), retraction of tissue from edges (poor processing)." },
      { question: "What is the purpose of antigen retrieval in immunohistochemistry?", idealAnswer: "Formalin fixation creates methylene cross-links that mask epitopes, preventing antibody binding. Antigen retrieval (HIER: heat-induced epitope retrieval using citrate buffer pH 6.0 or EDTA buffer pH 9.0, or PIER: protease-induced) breaks cross-links and unmasks antigens, restoring immunoreactivity for IHC." }
    ]
  },
  {
    id: "v006",
    subject: "Parasitology",
    question: "Describe the life cycle of Plasmodium falciparum and how it relates to clinical disease.",
    idealAnswer: "Mosquito injects sporozoites → hepatocytes (exo-erythrocytic schizogony, ~7 days; NO hypnozoites in P. falciparum) → merozoites released → infect all RBC stages (any age) → erythrocytic schizogony (48h cycle) → rupture releasing merozoites (+pyrogens) → fever. Some become gametocytes → ingested by Anopheles → sporogony in mosquito.",
    keyPoints: ["Sporozoite → liver (no dormancy in falciparum)", "All RBC ages infected (unlike vivax/ovale which prefer young RBCs)", "48-hour asexual erythrocytic cycle → fever", "Sequestration/cytoadherence → cerebral malaria", "Gametocytes → sexual cycle in mosquito"],
    followUps: [
      { question: "Why is P. falciparum more dangerous than P. vivax in terms of pathology?", idealAnswer: "Falciparum: infects all RBC stages → very high parasitaemia. RBCs express PfEMP1 → cytoadherence to endothelium/rosetting → microvascular occlusion → cerebral malaria, renal failure, ARDS. Vivax only infects reticulocytes → lower parasitaemia; can cause anaemia but less severe organ disease." },
      { question: "How would you diagnose malaria in a febrile patient returning from an endemic area?", idealAnswer: "Thick and thin Giemsa-stained blood films (gold standard) — species identification and parasite count. Rapid Diagnostic Test (RDT) for HRP2 (falciparum-specific) and pLDH (all species). PCR for low parasitaemia/species confirmation. Films should be repeated every 12–24h if negative but malaria suspected." },
      { question: "What are the criteria for severe (complicated) malaria?", idealAnswer: "WHO severe malaria criteria: cerebral malaria (impaired consciousness, coma), severe anaemia (Hb <5g/dL), respiratory distress (ARDS), hypoglycaemia (<2.2 mmol/L), circulatory collapse, abnormal bleeding/DIC, hyperparasitaemia (>5%), blackwater fever (haemoglobinuria), jaundice, acute kidney injury." }
    ]
  },
  {
    id: "v007",
    subject: "Chemical Pathology",
    question: "Explain renal function tests and how they are used to assess kidney function.",
    idealAnswer: "Serum urea and creatinine: filtered by glomeruli; elevated in reduced GFR (urea also reflects protein catabolism and tubular reabsorption). eGFR (CKD-EPI equation using creatinine, age, sex, ± cystatin C) is best overall estimate. Urine protein:creatinine ratio for proteinuria. 24h urine creatinine clearance. Urine microscopy: casts, cells. Electrolytes for tubular function.",
    keyPoints: ["Urea and creatinine — non-specific indicators of GFR", "eGFR more reliable than raw creatinine", "Cystatin C: rises earlier than creatinine", "Proteinuria: kidney damage marker", "Urine microscopy for glomerulonephritis (RBC casts)"],
    followUps: [
      { question: "At what level of GFR loss do serum creatinine levels start to rise significantly?", idealAnswer: "Serum creatinine rises significantly only after approximately 50% loss of GFR, due to the hyperbolic relationship between creatinine and GFR. In early CKD, creatinine may remain within the 'normal' reference range. This is why cystatin C and eGFR are more sensitive early markers." },
      { question: "How is acute kidney injury (AKI) defined and classified?", idealAnswer: "KDIGO AKI definition: rise in serum creatinine ≥26.5 µmol/L within 48h, OR ≥1.5x baseline within 7 days, OR urine output <0.5 mL/kg/h for ≥6h. AKI stages 1–3 based on creatinine rise and urine output. Classified as pre-renal, intrinsic renal, or post-renal." },
      { question: "What urine findings suggest glomerulonephritis rather than a pre-renal cause?", idealAnswer: "Glomerulonephritis: dysmorphic RBCs (acanthocytes), RBC casts in urine. Proteinuria (often >1g/day). WBC casts suggest pyelonephritis or interstitial nephritis. Pre-renal AKI: bland urine sediment, urine Na <20 mmol/L, FEna <1%, specific gravity >1.020." }
    ]
  },
  {
    id: "v008",
    subject: "Haematology",
    question: "What are the principles and interpretation of the prothrombin time (PT) and APTT?",
    idealAnswer: "PT (extrinsic pathway): patient plasma + thromboplastin (tissue factor + phospholipid) + CaCl₂ → clot time measured. Tests factors VII, X, V, II, I. Reported as PT ratio and INR. APTT (intrinsic pathway): patient plasma + phospholipid activator (kaolin/silica) + CaCl₂ → clot time. Tests factors XII, XI, IX, VIII, X, V, II, I. Both prolonged in common pathway defects.",
    keyPoints: ["PT: extrinsic + common pathway (VII, X, V, II, I)", "APTT: intrinsic + common pathway (XII, XI, IX, VIII, X, V, II, I)", "INR standardises PT across reagents", "Prolonged PT only: Factor VII deficiency/early warfarin", "Prolonged APTT only: haemophilia A/B (VIII/IX), vWD", "Both prolonged: DIC, liver disease, common pathway defects"],
    followUps: [
      { question: "A patient has a prolonged APTT that corrects on 50:50 mixing with normal plasma. What does this suggest?", idealAnswer: "Correction on mixing indicates a factor deficiency (not an inhibitor). The added normal plasma provides the deficient factor, shortening clotting time. An inhibitor (lupus anticoagulant, factor VIII inhibitor) would NOT correct — the inhibitor acts on normal plasma factors too." },
      { question: "How is warfarin therapy monitored and what is the target INR for atrial fibrillation?", idealAnswer: "Warfarin is monitored by INR (International Normalised Ratio) derived from PT. Target INR for AF stroke prevention: 2.0–3.0. Mechanical heart valves: 2.5–3.5. INR above 5.0 carries significant bleeding risk. Warfarin inhibits vitamin K epoxide reductase → reduced K-dependent factors (II, VII, IX, X, protein C/S)." },
      { question: "What is the role of thrombin time (TT) in coagulation testing?", idealAnswer: "TT: patient plasma + thrombin → direct fibrinogen → fibrin conversion time. Prolonged TT indicates: hypofibrinogenaemia (<1 g/L), dysfibrinogenaemia, heparin (therapeutic or contamination), FDP/D-dimer interference. TT is prolonged in DIC but not in haemophilia A/B (factors upstream of thrombin)." }
    ]
  },
  {
    id: "v009",
    subject: "Medical Microbiology",
    question: "How do you investigate and identify Mycobacterium tuberculosis in the laboratory?",
    idealAnswer: "Receive sputum (early morning, 3 consecutive specimens). Decontamination/concentration (NALC-NaOH method). ZN or auramine-rhodamine fluorescent microscopy (smear) for rapid AFB detection. Culture on LJ medium (8 weeks) or liquid culture (MGIT, 1–3 weeks) with automated growth detection. Identification: molecular (Xpert MTB/RIF, line probe assay), MALDI-TOF, biochemical (niacin, catalase tests). DST (drug susceptibility testing).",
    keyPoints: ["Specimen: 3 early morning sputum specimens", "Decontamination before culture", "ZN stain or fluorescence microscopy for AFBs", "Culture: LJ (slow, 8wks) or MGIT liquid culture (faster)", "Molecular: Xpert MTB/RIF for rapid detection + rifampicin resistance", "Drug susceptibility testing (DST)"],
    followUps: [
      { question: "What is the significance of the Xpert MTB/RIF assay in TB diagnosis?", idealAnswer: "Xpert MTB/RIF (GeneXpert) is a rapid real-time PCR cartridge test detecting M. tuberculosis DNA and rifampicin resistance (rpoB gene mutations) simultaneously in 2 hours. WHO-endorsed. Sensitivity ~89% (culture-positive TB), specificity ~99%. Critical for early detection and MDR-TB identification." },
      { question: "What defines multi-drug resistant TB (MDR-TB)?", idealAnswer: "MDR-TB: resistant to at least isoniazid AND rifampicin (the two most potent first-line TB drugs). XDR-TB (extensively drug resistant): MDR-TB + resistance to fluoroquinolones AND at least one injectable second-line drug (amikacin, kanamycin, capreomycin). Now replaced by XDR definition: MDR + resistance to any fluoroquinolone + at least one BPaL agent." },
      { question: "How does rifampicin work and what mechanisms lead to resistance?", idealAnswer: "Rifampicin inhibits bacterial RNA polymerase (β-subunit, rpoB gene). Resistance most commonly due to point mutations in the 81-bp 'hot spot' region of rpoB gene. Detected by Xpert (D516, H526, S531 common mutations). Resistance nearly always confers MDR-TB due to epidemiological linkage with INH resistance." }
    ]
  },
  {
    id: "v010",
    subject: "Immunology",
    question: "Describe the four types of hypersensitivity reactions with clinical examples.",
    idealAnswer: "Type I (IgE-mediated, immediate): IgE on mast cells + allergen → degranulation → anaphylaxis, asthma, hay fever. Type II (antibody-mediated cytotoxic): IgG/IgM against cell-surface antigens → complement/ADCC → autoimmune haemolytic anaemia, Goodpasture syndrome, myasthenia gravis. Type III (immune complex-mediated): IgG complexes → complement → serum sickness, SLE nephritis, post-streptococcal GN. Type IV (delayed, T cell-mediated): T cells → macrophage activation → contact dermatitis, TB, graft rejection.",
    keyPoints: ["Type I: IgE, immediate (minutes)", "Type II: IgG/IgM vs cells, cytotoxic (hours)", "Type III: immune complexes, complement (hours-days)", "Type IV: T cell, delayed (48–72 hours)", "Each type has distinct mechanism and clinical examples"],
    followUps: [
      { question: "How do you test for Type IV (delayed) hypersensitivity in clinical practice?", idealAnswer: "Mantoux/tuberculin skin test: intradermal PPD (purified protein derivative) injected; read at 48–72h. Positive: ≥10 mm induration = sensitised T cells (previous TB exposure/BCG). Patch testing for contact dermatitis allergens. IGRA (QuantiFERON-TB Gold) measures IFN-γ from sensitised T cells in vitro." },
      { question: "Explain the immunological basis of serum sickness (Type III hypersensitivity).",  idealAnswer: "Serum sickness: administration of foreign serum/protein antigen → IgG antibodies form → antigen-antibody immune complexes → deposit in vessel walls, glomeruli, synovium → complement activation (C3a/C5a) → neutrophil recruitment → inflammation → fever, arthritis, nephritis, urticaria. Typically 1–3 weeks after antigen exposure." },
      { question: "How does anaphylaxis differ from an anaphylactoid reaction?", idealAnswer: "Anaphylaxis: IgE-mediated (requires prior sensitisation); mast cell/basophil degranulation via IgE-FcεRI crosslinking. Anaphylactoid: clinically identical presentation but NOT IgE-mediated; can occur on first exposure (contrast media, aspirin, opiates direct mast cell degranulation). Management is same (adrenaline); skin tests useful only for true anaphylaxis." }
    ]
  },
];

import { shuffleArray } from "./mcqs";
export function generateVivaSet(setIndex: number): VivaQuestion[] {
  const rotated = [...vivaBank.slice(setIndex % vivaBank.length), ...vivaBank.slice(0, setIndex % vivaBank.length)];
  return shuffleArray(rotated).slice(0, 10);
}
