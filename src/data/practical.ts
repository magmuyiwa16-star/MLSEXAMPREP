export type PracticalSubject =
  | "Chemical Pathology"
  | "Haematology"
  | "Blood Group Serology"
  | "Histopathology"
  | "Medical Microbiology"
  | "Parasitology";

export interface LabResult {
  test: string;
  value: string;
  referenceRange: string;
  flag?: "H" | "L" | "N";
}

export interface PracticalQuestion {
  question: string;
  marks: number;
  modelAnswer: string;
}

export interface PracticalCase {
  id: string;
  subject: PracticalSubject;
  title: string;
  scenario: string;
  labResults: LabResult[];
  questions: PracticalQuestion[];
}

export interface StructuredAnswer {
  title: string;
  aim: string;
  materials: string;
  method: string;
  principle: string;
  procedure: string;
  referenceRange: string;
  result: string;
  clinicalSignificance: string;
}

export const practicalCases: PracticalCase[] = [
  // ── SET A ─────────────────────────────────────────────────────────────────
  {
    id: "pr_chem_001",
    subject: "Chemical Pathology",
    title: "Diabetic Ketoacidosis",
    scenario:
      "A 19-year-old male was brought to the A&E in Ibadan unconscious. His mother reports he has been vomiting, breathing rapidly, and has not eaten for 2 days. He was diagnosed with Type 1 DM 2 years ago but has been non-compliant with insulin. On examination: GCS 10/15, RR 28/min, fruity breath odour, BP 90/60 mmHg.",
    labResults: [
      { test: "Random blood glucose", value: "34.2 mmol/L", referenceRange: "3.9–7.8 mmol/L", flag: "H" },
      { test: "Serum potassium", value: "5.8 mmol/L", referenceRange: "3.5–5.0 mmol/L", flag: "H" },
      { test: "Serum sodium", value: "128 mmol/L", referenceRange: "135–145 mmol/L", flag: "L" },
      { test: "Bicarbonate (HCO₃⁻)", value: "8 mmol/L", referenceRange: "22–29 mmol/L", flag: "L" },
      { test: "Anion gap", value: "28 mEq/L", referenceRange: "8–12 mEq/L", flag: "H" },
      { test: "Urine ketones", value: "3+ (strongly positive)", referenceRange: "Negative", flag: "H" },
      { test: "pH (arterial)", value: "7.14", referenceRange: "7.35–7.45", flag: "L" },
    ],
    questions: [
      {
        question: "What is the most likely diagnosis based on the clinical and laboratory findings? Give your interpretation of the laboratory results.",
        marks: 4,
        modelAnswer:
          "Diagnosis: Diabetic Ketoacidosis (DKA). Interpretation: Severe hyperglycaemia (34.2 mmol/L), metabolic acidosis (pH 7.14, HCO₃⁻ 8 mmol/L), high anion gap (28 mEq/L) indicating accumulation of ketoacids (β-hydroxybutyrate, acetoacetate), ketonuria (3+), hyponatraemia (dilutional), and pseudohyperkalaemia (acidosis drives K⁺ extracellular shift). Together these meet the biochemical criteria for DKA.",
      },
      {
        question: "Describe the procedure for measuring blood glucose using the glucose oxidase method.",
        marks: 3,
        modelAnswer:
          "Title: Blood Glucose Estimation by Glucose Oxidase Method. Principle: Glucose + O₂ → gluconolactone + H₂O₂ (glucose oxidase); H₂O₂ + chromogen → coloured product (peroxidase). Materials: plasma/serum, glucose oxidase-peroxidase reagent, glucose standard, spectrophotometer. Procedure: (1) Dispense 1 mL reagent into test, standard, and blank tubes. (2) Add 10 µL patient plasma/standard/distilled water. (3) Mix and incubate 10 min at 37°C. (4) Read absorbance at 505 nm against blank. (5) Calculate: Patient glucose = (Abs patient / Abs standard) × Standard concentration.",
      },
      {
        question: "What is the clinical significance of measuring the anion gap in this patient?",
        marks: 3,
        modelAnswer:
          "Anion gap = Na⁺ – (Cl⁻ + HCO₃⁻). In this patient AG = 28 mEq/L (normal 8–12). A high anion gap indicates unmeasured anions — in DKA these are ketoacids (β-hydroxybutyrate, acetoacetate) that replace bicarbonate. The AG helps: (1) Confirm organic acid accumulation, (2) Classify the metabolic acidosis type (HAGMA vs normal AG), (3) Assess severity and monitor treatment response as AG should normalise with insulin and fluids.",
      },
    ],
  },
  {
    id: "pr_haem_001",
    subject: "Haematology",
    title: "Iron Deficiency Anaemia",
    scenario:
      "A 28-year-old woman at UCH Ibadan presents with progressive fatigue, pallor, and dyspnoea on exertion for 3 months. She reports heavy menstrual periods (soaking 8–10 pads daily). She is vegetarian. On examination: pale conjunctivae, angular stomatitis, koilonychia, HR 108/min.",
    labResults: [
      { test: "Haemoglobin", value: "6.4 g/dL", referenceRange: "12.0–16.0 g/dL", flag: "L" },
      { test: "MCV", value: "62 fL", referenceRange: "80–100 fL", flag: "L" },
      { test: "MCH", value: "19 pg", referenceRange: "27–32 pg", flag: "L" },
      { test: "MCHC", value: "28 g/dL", referenceRange: "32–36 g/dL", flag: "L" },
      { test: "Serum ferritin", value: "4 µg/L", referenceRange: "15–200 µg/L", flag: "L" },
      { test: "Serum iron", value: "4 µmol/L", referenceRange: "11–30 µmol/L", flag: "L" },
      { test: "TIBC", value: "78 µmol/L", referenceRange: "45–70 µmol/L", flag: "H" },
      { test: "Reticulocyte count", value: "0.4%", referenceRange: "0.5–2.5%", flag: "L" },
    ],
    questions: [
      {
        question: "Interpret the full blood count and iron studies, and state the type of anaemia.",
        marks: 3,
        modelAnswer:
          "Microcytic hypochromic anaemia (low Hb 6.4 g/dL, low MCV 62 fL, low MCH 19 pg, low MCHC 28 g/dL). Iron studies confirm iron deficiency: serum ferritin critically low (4 µg/L = depleted stores), serum iron low, TIBC elevated (increased iron-binding capacity as transferrin is upregulated). Low reticulocytosis indicates bone marrow unable to compensate. Diagnosis: Iron deficiency anaemia, severe (Hb <7 g/dL).",
      },
      {
        question: "Describe the procedure for measuring serum ferritin and its clinical significance in iron-deficiency anaemia.",
        marks: 4,
        modelAnswer:
          "Title: Serum Ferritin Assay (ELISA/chemiluminescence immunoassay). Aim: To quantify iron stores. Principle: Sandwich ELISA — capture antibody on plate binds ferritin; detection antibody-enzyme conjugate produces signal. Materials: serum, ferritin antibody, enzyme substrate, standards, microplate reader. Procedure: (1) Coat wells with anti-ferritin antibody. (2) Add patient serum and standards. (3) Incubate 1h. (4) Wash away unbound. (5) Add detection antibody. (6) Wash. (7) Add substrate → colour. (8) Read absorbance at 450 nm. Reference range: 15–200 µg/L (women). Clinical significance: Ferritin is the most sensitive and specific indicator of depleted iron stores. Values <12 µg/L confirm iron deficiency even before anaemia develops. Unlike serum iron, ferritin is unaffected by diurnal variation.",
      },
      {
        question: "How would you differentiate iron deficiency anaemia from anaemia of chronic disease on laboratory findings?",
        marks: 3,
        modelAnswer:
          "IDA vs ACD: (1) Serum ferritin: LOW in IDA (depleted stores); NORMAL/HIGH in ACD (ferritin is acute phase reactant). (2) TIBC: HIGH in IDA (increased transferrin); LOW/NORMAL in ACD (reduced transferrin synthesis). (3) Serum iron: LOW in both. (4) Transferrin saturation: <16% in IDA; may be low but not as markedly in ACD. (5) Soluble transferrin receptor (sTfR): elevated in IDA; normal in ACD. (6) sTfR/log ferritin index: >2 suggests IDA, <1 suggests ACD.",
      },
    ],
  },
  {
    id: "pr_blood_001",
    subject: "Blood Group Serology",
    title: "Haemolytic Transfusion Reaction Investigation",
    scenario:
      "A 35-year-old sickle cell disease patient (Group A, Rh(D) positive) at OOUTH Sagamu was transfused with 2 units of packed red cells. Thirty minutes into the second unit, she develops fever (39.2°C), rigors, flank pain, and passes dark brown urine. The transfusion is immediately stopped. A repeat sample is collected post-transfusion.",
    labResults: [
      { test: "Pre-transfusion Hb", value: "5.8 g/dL", referenceRange: "12–16 g/dL", flag: "L" },
      { test: "Post-transfusion Hb (2h)", value: "4.9 g/dL", referenceRange: "12–16 g/dL", flag: "L" },
      { test: "Direct Antiglobulin Test (post-Tx)", value: "Positive (IgG 3+)", referenceRange: "Negative", flag: "H" },
      { test: "Serum LDH (post-Tx)", value: "1820 IU/L", referenceRange: "140–280 IU/L", flag: "H" },
      { test: "Serum bilirubin – indirect", value: "68 µmol/L", referenceRange: "3–17 µmol/L", flag: "H" },
      { test: "Haptoglobin", value: "Undetectable", referenceRange: "0.5–3.2 g/L", flag: "L" },
      { test: "Urine haemoglobin", value: "Positive 3+", referenceRange: "Negative", flag: "H" },
    ],
    questions: [
      {
        question: "What type of transfusion reaction is occurring? Interpret the laboratory findings and explain the pathophysiology.",
        marks: 4,
        modelAnswer:
          "Acute haemolytic transfusion reaction (AHTR) — intravascular haemolysis. Pathophysiology: recipient alloantibody (likely anti-Kidd [Jk] or anti-Rh) reacts with donor RBC antigens → complement activation → intravascular haemolysis → haemoglobinaemia and haemoglobinuria. Lab findings: (1) DAT 3+ (donor RBCs coated with antibody in vivo), (2) LDH elevated 6× (released from destroyed RBCs), (3) Indirect bilirubin elevated (haem breakdown product), (4) Haptoglobin undetectable (consumed binding free Hb), (5) Haemoglobinuria (haemoglobinaemia exceeds haptoglobin binding → free Hb filtered by kidneys). Fall in Hb post-transfusion = failure of increment.",
      },
      {
        question: "Describe the stepwise laboratory investigation protocol for a suspected haemolytic transfusion reaction.",
        marks: 3,
        modelAnswer:
          "Protocol: (1) Stop transfusion immediately; keep IV access. (2) Notify blood bank. (3) Samples: pre- and post-transfusion EDTA (DAT, repeat group), clotted blood (LDH, bilirubin, haptoglobin, U&E), urine (haemoglobin). (4) Return blood bag + administration set to blood bank. (5) Blood bank: repeat ABO/Rh on pre- and post-samples; repeat crossmatch; DAT on post-transfusion sample; eluate study (identify antibody); antibody screen and panel on pre- and post-samples. (6) Blood culture if TACO/TRALI/sepsis suspected.",
      },
      {
        question: "How would you perform and interpret the Direct Antiglobulin Test (DAT)?",
        marks: 3,
        modelAnswer:
          "Title: Direct Antiglobulin Test (DAT). Principle: Detects IgG antibodies and/or complement (C3d) directly coating patient's circulating RBCs in vivo. Materials: washed patient RBCs, polyspecific AHG (anti-IgG + anti-C3d), monospecific AHG reagents, IgG-coated check cells. Procedure: (1) Wash patient RBCs 3× in saline (removes unbound immunoglobulins). (2) Add 1 drop of polyspecific AHG to washed cells. (3) Centrifuge, read for agglutination. (4) If positive, perform monospecific DAT (anti-IgG, anti-C3d separately). (5) Negative DAT: add check cells (must agglutinate). Interpretation: Positive = RBCs coated in vivo; causes: AIHA, HTR, HDN, drug-induced. Grading 1+ to 4+ indicates amount of coating.",
      },
    ],
  },
  {
    id: "pr_histo_001",
    subject: "Histopathology",
    title: "Hepatocellular Carcinoma on Background Cirrhosis",
    scenario:
      "A 52-year-old male presents to UCH liver clinic with 4-month history of right upper quadrant pain, weight loss (12 kg), and progressive abdominal distension. He is a known HBV carrier (HBsAg positive for 18 years) and chronic alcoholic. Examination: hepatomegaly (15 cm), jaundice, ascites, spider naevi. A core needle biopsy of a hepatic mass is performed.",
    labResults: [
      { test: "AFP (Alpha-fetoprotein)", value: "1840 ng/mL", referenceRange: "<10 ng/mL", flag: "H" },
      { test: "Total bilirubin", value: "82 µmol/L", referenceRange: "5–21 µmol/L", flag: "H" },
      { test: "ALT", value: "228 U/L", referenceRange: "7–56 U/L", flag: "H" },
      { test: "ALP", value: "412 U/L", referenceRange: "44–147 U/L", flag: "H" },
      { test: "Albumin", value: "22 g/L", referenceRange: "35–50 g/L", flag: "L" },
      { test: "INR", value: "1.9", referenceRange: "0.8–1.2", flag: "H" },
      { test: "HBsAg", value: "Positive", referenceRange: "Negative", flag: "H" },
    ],
    questions: [
      {
        question: "Describe the expected histopathological features of hepatocellular carcinoma on liver biopsy.",
        marks: 3,
        modelAnswer:
          "HCC on H&E: (1) Architecture — trabecular (sinusoid-lined plates of tumour cells), pseudoglandular (acinar), solid, or mixed patterns. (2) Cytology — large pleomorphic hepatocyte-like cells with prominent nucleoli, increased N:C ratio, abundant eosinophilic cytoplasm, bile production (pathognomonic). (3) Background — cirrhosis with fibrous bands, regenerative nodules. (4) Vascular invasion — common. (5) IHC: Hep Par-1, Glypican-3, AFP positive; CK7/CK20 negative (unlike metastatic adenocarcinoma).",
      },
      {
        question: "What is the significance of AFP (alpha-fetoprotein) in this patient and what are its limitations as a tumour marker?",
        marks: 3,
        modelAnswer:
          "AFP: markedly elevated (1840 ng/mL, normal <10 ng/mL). Significance: (1) Strongly supports HCC diagnosis in high-risk patient with liver mass. (2) Values >400 ng/mL in cirrhotic patient with hepatic mass = HCC until proven otherwise (no biopsy required in most guidelines). (3) Used for monitoring treatment response and detecting recurrence. Limitations: (1) Not specific — also elevated in germ cell tumours (yolk sac), hepatoblastoma, acute/chronic hepatitis. (2) Not sensitive — 30–40% of HCC (especially early) have normal AFP. (3) Poor predictor of HCC biology.",
      },
      {
        question: "What processing steps are required to prepare a liver core biopsy from fixation through to H&E staining?",
        marks: 4,
        modelAnswer:
          "Processing a core biopsy: (1) Fixation: immerse in 10% neutral buffered formalin, minimum 6h (up to 24h). (2) Grossing: measure core length, ink if needed, submit entirely in cassette. (3) Tissue processing (automated): dehydration (graded ethanol 70%→80%→95%→100%), clearing (xylene ×2–3), wax impregnation (paraffin 60°C ×2–3). (4) Embedding: orient core horizontally in paraffin block. (5) Microtomy: 3–4 µm sections with rotary microtome; float sections on warm water bath (45°C), mount on APES/poly-L-lysine-coated slides. (6) H&E staining: dewax (xylene), rehydrate (graded alcohols), haematoxylin (5 min), rinse, differentiate (1% HCl-alcohol), blue (Scott's water), eosin (2 min), dehydrate, clear, mount with DPX.",
      },
    ],
  },
  {
    id: "pr_micro_001",
    subject: "Medical Microbiology",
    title: "Bacterial Meningitis",
    scenario:
      "A 16-month-old child is brought to OOUTH Sagamu with high fever (40°C), irritability, and refusing to feed for 12 hours. On examination: bulging anterior fontanelle, neck stiffness, photophobia, and a non-blanching petechial rash. CSF was urgently collected by lumbar puncture.",
    labResults: [
      { test: "CSF appearance", value: "Turbid, yellow (xanthochromic)", referenceRange: "Clear, colourless", flag: "H" },
      { test: "CSF WBC", value: "3200 cells/mm³ (98% neutrophils)", referenceRange: "<5 cells/mm³", flag: "H" },
      { test: "CSF protein", value: "2.8 g/L", referenceRange: "0.15–0.45 g/L", flag: "H" },
      { test: "CSF glucose", value: "1.1 mmol/L", referenceRange: "2.2–3.9 mmol/L", flag: "L" },
      { test: "Blood glucose (simultaneous)", value: "5.4 mmol/L", referenceRange: "3.9–6.1 mmol/L", flag: "N" },
      { test: "CSF:blood glucose ratio", value: "0.20", referenceRange: ">0.6", flag: "L" },
      { test: "Gram stain (CSF)", value: "Gram-negative diplococci intracellularly", referenceRange: "No organisms seen", flag: "H" },
    ],
    questions: [
      {
        question: "Interpret the CSF results and state the most likely causative organism. What is your diagnosis?",
        marks: 3,
        modelAnswer:
          "Diagnosis: Acute bacterial meningitis secondary to Neisseria meningitidis. Interpretation: (1) Turbid CSF = elevated WBC/protein. (2) Marked neutrophilic pleocytosis (3200 cells/mm³, 98% PMN) = purulent meningitis. (3) Elevated protein (2.8 g/L) = blood-brain barrier disruption and exudation. (4) Low CSF glucose (1.1 mmol/L) and CSF:blood glucose ratio 0.20 (<0.6) = bacterial consumption. (5) Gram-negative diplococci (intracellular in PMNs) = characteristic of N. meningitidis. Non-blanching rash + petechiae = meningococcaemia with DIC.",
      },
      {
        question: "Describe the microbiological investigation of the CSF sample including Gram staining technique.",
        marks: 4,
        modelAnswer:
          "CSF Investigation: (1) Macroscopy: note turbidity, colour, fibrin clot. (2) Cell count: counting chamber (haemocytometer), classify cells (PMN vs mononuclear). (3) Biochemistry: protein (biuret), glucose (enzymatic), lactate (elevated in bacterial). (4) Gram stain: (a) Prepare smear from centrifuged deposit; air-dry; heat-fix. (b) Flood with crystal violet 1 min; wash. (c) Flood with Gram's iodine 1 min; wash. (d) Decolourise with acetone-alcohol 10–15 sec; wash immediately. (e) Counterstain with safranin 1 min; wash; dry. (f) Examine ×100 oil immersion. N. meningitidis: Gram-negative diplococci in PMNs. (5) Culture: blood agar, chocolate agar, incubate 35–37°C in 5–10% CO₂, 24–48h. (6) Latex agglutination for bacterial antigens (rapid). (7) PCR for meningococcal DNA.",
      },
      {
        question: "How do you differentiate bacterial from viral (aseptic) meningitis on CSF analysis?",
        marks: 3,
        modelAnswer:
          "CSF differential diagnosis: (1) Appearance: bacterial = turbid; viral = clear. (2) WBC: bacterial = >1000 cells/mm³ (PMN predominant); viral = 10–500 cells/mm³ (lymphocytic). (3) Protein: bacterial = >1.0 g/L; viral = mildly elevated 0.5–1.0 g/L or normal. (4) Glucose: bacterial = LOW (<2.2 mmol/L, ratio <0.6); viral = NORMAL. (5) Gram stain/Culture: bacterial = positive (60–90%); viral = negative. (6) Lactate: bacterial >3.5 mmol/L; viral normal. (7) Procalcitonin/CRP: markedly elevated in bacterial.",
      },
    ],
  },
  {
    id: "pr_para_001",
    subject: "Parasitology",
    title: "Severe Falciparum Malaria",
    scenario:
      "A 4-year-old child from Ogun State is brought to OOUTH Sagamu unconscious. Parents report 5 days of fever, vomiting, and inability to eat. The child is very pale, with laboured breathing. Temperature 39.8°C, SpO₂ 88%, GCS 7/15. The child is from a malaria-endemic area with no bed net or prophylaxis use.",
    labResults: [
      { test: "Thick blood film (Giemsa)", value: "P. falciparum detected, parasitaemia 12%", referenceRange: "No parasites", flag: "H" },
      { test: "Haemoglobin", value: "4.2 g/dL", referenceRange: "10.5–14.0 g/dL (child)", flag: "L" },
      { test: "Blood glucose", value: "1.4 mmol/L", referenceRange: "3.9–6.1 mmol/L", flag: "L" },
      { test: "Serum creatinine", value: "188 µmol/L", referenceRange: "27–62 µmol/L (child)", flag: "H" },
      { test: "Total bilirubin", value: "68 µmol/L", referenceRange: "5–21 µmol/L", flag: "H" },
      { test: "Platelet count", value: "38 × 10⁹/L", referenceRange: "150–400 × 10⁹/L", flag: "L" },
      { test: "Malaria RDT (HRP2)", value: "Positive", referenceRange: "Negative", flag: "H" },
    ],
    questions: [
      {
        question: "This child meets criteria for severe malaria. Identify at least FOUR criteria for severity present and explain the pathophysiology.",
        marks: 4,
        modelAnswer:
          "Severe malaria criteria present: (1) Cerebral malaria (GCS 7/15, unarousable coma) — PfEMP1-mediated cytoadherence to brain endothelium, rosetting, sequestration → microvascular obstruction → cerebral oedema. (2) Severe anaemia (Hb 4.2 g/dL) — RBC destruction by merozoites, immune-mediated haemolysis, dyserythropoiesis, splenic sequestration. (3) Hypoglycaemia (1.4 mmol/L) — parasite glucose consumption + quinine-stimulated insulin release + hepatic glycogen depletion. (4) Respiratory distress (SpO₂ 88%) — severe anaemia + possible ARDS from sequestration in pulmonary vasculature. (5) Hyperparasitaemia (12% >5%) — high parasite burden. (6) Acute kidney injury (creatinine 188 µmol/L) — microvascular obstruction. (7) Thrombocytopaenia (38×10⁹/L) — splenic sequestration, immune destruction.",
      },
      {
        question: "Describe the laboratory technique for preparing and staining thick and thin blood films for malaria diagnosis.",
        marks: 4,
        modelAnswer:
          "Thick and thin blood film preparation: Materials: finger-prick capillary blood, clean slides, Giemsa stain, buffer pH 7.2, immersion oil, microscope. Thin film: Place 1 small drop of blood 2 cm from end; use spreader at 30–45° angle to push drop across slide in one smooth motion; air dry immediately; DO NOT LYSE. Thick film: Place 2–3 drops adjacent; spread with corner of slide in circular motion to make ~1.5 cm circle; let dry 20–30 min (do not fix). Staining: (1) Fix thin film only in methanol 30 sec; DON'T fix thick film. (2) Flood both with 10% Giemsa (in pH 7.2 buffer) for 10 min (thick) / 20 min (thin). (3) Rinse gently with buffered water; allow to dry vertically. Reading: Thick film: scan ×40 objective, confirm ×100 oil; examine 100 high-power fields before calling negative. Species ID on thin film at ×100 oil immersion.",
      },
      {
        question: "How do you calculate and report malaria parasite count and what is its clinical importance?",
        marks: 2,
        modelAnswer:
          "Parasite count (thin film method): Count parasitised RBCs per 1000 RBCs on thin film. Parasitaemia % = (parasitised cells ÷ total RBCs counted) × 100. Thick film (WHO method): Count asexual parasites against 200 WBCs; multiply by (WBC/µL ÷ 200) to give parasites/µL. Example: 600 parasites/200 WBCs × 8000 WBC/µL ÷ 200 = 24,000 parasites/µL. Clinical importance: (1) Parasitaemia >5% = hyperparasitaemia (severe malaria criterion). (2) Guides urgency of treatment (parenteral artemisinin for severe). (3) Monitoring treatment — should fall by >90% in 48h with effective therapy. (4) Parasite clearance time evaluates drug efficacy.",
      },
    ],
  },

  // ── SET B (alternate cases used in set rotation) ──────────────────────────
  {
    id: "pr_chem_002",
    subject: "Chemical Pathology",
    title: "Acute Kidney Injury with Hyperkalaemia",
    scenario:
      "A 60-year-old hypertensive man presents with oliguria, nausea, and leg swelling for 3 days following NSAID use for back pain. His known baseline creatinine was 90 µmol/L. On examination: BP 170/100 mmHg, pitting oedema to mid-thigh, no urine output for 18 hours.",
    labResults: [
      { test: "Serum creatinine", value: "780 µmol/L", referenceRange: "60–110 µmol/L", flag: "H" },
      { test: "Serum urea", value: "42 mmol/L", referenceRange: "2.5–7.8 mmol/L", flag: "H" },
      { test: "Serum potassium", value: "6.9 mmol/L", referenceRange: "3.5–5.0 mmol/L", flag: "H" },
      { test: "Serum sodium", value: "130 mmol/L", referenceRange: "135–145 mmol/L", flag: "L" },
      { test: "Bicarbonate", value: "14 mmol/L", referenceRange: "22–29 mmol/L", flag: "L" },
      { test: "pH (venous)", value: "7.21", referenceRange: "7.31–7.41", flag: "L" },
      { test: "Urine output (24h)", value: "80 mL", referenceRange: ">400 mL/24h", flag: "L" },
    ],
    questions: [
      {
        question: "Classify this AKI and identify the likely cause. Why is hyperkalaemia a medical emergency in this patient?",
        marks: 3,
        modelAnswer:
          "AKI classification: Likely KDIGO Stage 3 AKI (creatinine 8.7× baseline [780/90]). Cause: NSAID-induced pre-renal to intrinsic renal AKI — NSAIDs inhibit prostaglandin synthesis, causing afferent arteriolar vasoconstriction → reduced renal perfusion → ischaemic AKI; also direct tubular toxicity. Hyperkalaemia emergency: K⁺ 6.9 mmol/L = severe. Acidosis drives K⁺ out of cells (1 mmol/L rise per 0.1 fall in pH). Hyperkalaemia → cardiac membrane depolarisation → peaked T waves → wide QRS → VF → cardiac arrest. Requires emergency management: calcium gluconate (cardiac membrane stabilisation), insulin + dextrose (K⁺ shift), salbutamol nebulisation, kayexalate, urgent dialysis.",
      },
      {
        question: "Describe the Jaffe method for serum creatinine measurement and its limitations.",
        marks: 3,
        modelAnswer:
          "Jaffe reaction: creatinine + alkaline picrate → orange-red creatinine-picrate complex; measured spectrophotometrically at 510 nm. Principle: Creatinine reacts with sodium picrate in alkaline conditions to form coloured Janovsky complex. Procedure: (1) Mix serum with sodium picrate + NaOH. (2) Read absorbance at 510 nm at exactly 20 and 80 seconds (kinetic method minimises interference). (3) Calculate using calibrator. Limitations: (1) Non-specificity — pseudochromogens (glucose, bilirubin, ketones, cephalosporins, haemolysis) falsely elevate result. (2) Bilirubin interferes negatively. (3) Less accurate at low concentrations (e.g., children, muscular atrophy). Enzymatic methods (creatinine amidohydrolase) are more specific and now preferred.",
      },
      {
        question: "What is the significance of the urea:creatinine ratio in distinguishing types of AKI?",
        marks: 4,
        modelAnswer:
          "Urea:creatinine ratio (both in SI units: mmol/L and µmol/L — ratio = urea (mmol/L) × 1000 / creatinine (µmol/L) × 100 approx): Traditional ratio (both in mg/dL): normal ~10–20:1. Pre-renal AKI: ratio >20:1 — urea disproportionately elevated because: tubular reabsorption of urea is enhanced with low urine flow (unlike creatinine which is NOT reabsorbed). Urea also rises with high protein catabolism, GI bleed, dehydration. Intrinsic/renal AKI: ratio <10:1 — tubular damage prevents urea reabsorption, so both rise proportionally. Post-renal AKI: ratio variable (>20:1 acutely). In this patient: urea 42/creatinine 0.78 mg/dL-equivalent — ratio suggests mixed picture with significant tubular component.",
      },
    ],
  },
  {
    id: "pr_haem_002",
    subject: "Haematology",
    title: "Chronic Myeloid Leukaemia (CML)",
    scenario:
      "A 45-year-old male civil servant presents with 4 months of progressive abdominal fullness, fatigue, and night sweats. He has lost 8 kg in weight. Examination reveals massive splenomegaly (18 cm below left costal margin), mild hepatomegaly, and pallor. He has no lymphadenopathy.",
    labResults: [
      { test: "WBC", value: "285 × 10⁹/L", referenceRange: "4–11 × 10⁹/L", flag: "H" },
      { test: "Haemoglobin", value: "9.1 g/dL", referenceRange: "13–17 g/dL", flag: "L" },
      { test: "Platelet count", value: "820 × 10⁹/L", referenceRange: "150–400 × 10⁹/L", flag: "H" },
      { test: "Peripheral film", value: "Full granulocyte spectrum: blasts 3%, myelocytes 18%, metamyelocytes, bands, PMN; basophilia; eosinophilia", referenceRange: "Normal WBC differential", flag: "H" },
      { test: "Neutrophil Alkaline Phosphatase (NAP score)", value: "12 (low)", referenceRange: "20–100", flag: "L" },
      { test: "Serum B12", value: ">1500 pg/mL", referenceRange: "200–700 pg/mL", flag: "H" },
      { test: "BCR-ABL1 (FISH/RT-PCR)", value: "Positive", referenceRange: "Negative", flag: "H" },
    ],
    questions: [
      {
        question: "Interpret the clinical and laboratory findings. What is the diagnosis and what confirms it?",
        marks: 3,
        modelAnswer:
          "Diagnosis: Chronic Myeloid Leukaemia (CML), chronic phase. Interpretation: (1) Leukocytosis 285×10⁹/L with full granulocytic maturation spectrum on film (blasts only 3% — if >15% = accelerated phase). (2) Massive splenomegaly due to extramedullary haematopoiesis. (3) Thrombocytosis (reactive in CML). (4) Low NAP score differentiates CML from leukaemoid reaction (leukaemoid reaction: high NAP). (5) Elevated B12 from TC-III release by granulocytes. Confirmation: BCR-ABL1 positive (Philadelphia chromosome t(9;22)) by FISH or RT-PCR is pathognomonic. Bone marrow: hypercellular with full granulocytic series.",
      },
      {
        question: "Describe the Neutrophil Alkaline Phosphatase (NAP) scoring test, its principle, and interpretation.",
        marks: 3,
        modelAnswer:
          "NAP Score: Principle: Alkaline phosphatase in neutrophil granules (specific secondary granules) cleaves naphthol from substrate → naphthol couples with diazonium salt → insoluble azo dye deposited at enzyme site. Method: (1) Fresh peripheral blood film (capillary blood preferred, must be fresh). (2) Fix in formalin vapour or acetone-methanol. (3) Incubate in substrate (sodium naphthyl phosphate + Fast Violet B dye) at pH 9.5 for 30 min. (4) Counter-stain with haematoxylin. (5) Count 100 neutrophils; score each 0–4 based on intensity of granular staining. NAP Score = sum of scores (0–400). Interpretation: Normal 20–100. LOW (<20): CML (mature neutrophils lack enzyme due to BCR-ABL suppression), PNH, infectious mononucleosis. HIGH (>100): Leukaemoid reaction, polycythaemia vera, pregnancy, inflammation.",
      },
      {
        question: "What are the three phases of CML and how does laboratory monitoring guide treatment?",
        marks: 4,
        modelAnswer:
          "CML phases: (1) Chronic phase: blasts <10% in blood/marrow; most patients present here; splenomegaly; responds well to TKI. (2) Accelerated phase: blasts 10–19%, basophils ≥20%, persistent thrombocytopaenia <100×10⁹/L unrelated to therapy, additional cytogenetic changes (clonal evolution). (3) Blast crisis (blast phase): blasts ≥20% (myeloid 70% or lymphoid 30%); behaves like acute leukaemia; poor prognosis. Treatment monitoring with TKIs (imatinib/dasatinib/nilotinib): (a) Complete haematological response: normal CBC by 3 months. (b) Complete cytogenetic response: no Philadelphia chromosome by FISH by 12 months. (c) Major molecular response: BCR-ABL1 transcript ≤0.1% by RT-PCR at 12 months. Rising BCR-ABL1 = treatment failure or resistance — mutation analysis (T315I = kinase domain mutation).",
      },
    ],
  },
];

// Rotate cases to generate different sets
export function generatePracticalSet(setIndex: number): PracticalCase[] {
  // Always need one of each subject
  const subjects: PracticalSubject[] = [
    "Chemical Pathology",
    "Haematology",
    "Blood Group Serology",
    "Histopathology",
    "Medical Microbiology",
    "Parasitology",
  ];

  // Group cases by subject
  const bySubject: Record<string, PracticalCase[]> = {};
  for (const s of subjects) bySubject[s] = [];
  for (const c of practicalCases) bySubject[c.subject].push(c);

  // Pick one per subject (rotate with setIndex)
  return subjects.map((subject) => {
    const available = bySubject[subject];
    return available[setIndex % available.length];
  });
}
