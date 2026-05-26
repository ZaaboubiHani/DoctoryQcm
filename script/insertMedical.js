const mongoose = require("mongoose");
const Residency = require("../models/residency"); // Adjust path as needed
const ResidencyQuestion = require("../models/residencyQuestion"); // Adjust path as needed
require("dotenv").config(); // If you're using dotenv for environment variables

async function insertData() {
  try {
    // 1️⃣ Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'doctoryQcm',
    });
    console.log("✅ Connected to MongoDB");

    // 2️⃣ Find the highest index for Residency and create new one
    const lastResidency = await Residency.findOne().sort({ index: -1 });
    const newResidencyIndex = lastResidency ? lastResidency.index + 1 : 1;

    const residency = new Residency({
      name: "Médical",
      date: new Date("2025-01-01"),
      index: newResidencyIndex,
    });

    const savedResidency = await residency.save();
    console.log("✅ Residency created:", savedResidency);

    // 3️⃣ Find the highest index for ResidencyQuestion
    const lastQuestion = await ResidencyQuestion.findOne().sort({ index: -1 });
    let questionIndex = lastQuestion ? lastQuestion.index + 1 : 1;

    // 4️⃣ Define all questions
    const questions = [
      {
        text: "Les signes suivants sont des signes d'évolutivité clinique dans le lymphome de Hodgkin :",
        choices: [
          { letter: "A", text: "Les prurits" },
          { letter: "B", text: "La fièvre" },
          { letter: "C", text: "Les sueurs" },
          { letter: "D", text: "L'asthénie" }
        ]
      },
      {
        text: "Le chromosome Philadelphie :",
        choices: [
          { letter: "A", text: "Est une anomalie acquise" },
          { letter: "B", text: "Est une translocation réciproque entre les chromosomes 9 et 18" },
          { letter: "C", text: "Est une translocation réciproque entre les chromosomes 9 et 22" },
          { letter: "D", text: "L'onco-protéine résultante est responsable de la leucémie myéloïde chronique" }
        ]
      },
      {
        text: "Le diagnostic différentiel d'un eczéma de contact du visage se fait avec :",
        choices: [
          { letter: "A", text: "L'érysipele" },
          { letter: "B", text: "L'angioœdème" },
          { letter: "C", text: "Le zona" },
          { letter: "D", text: "La dermatite d'irritation" }
        ]
      },
      {
        text: "Cutibacterium acnes :",
        choices: [
          { letter: "A", text: "Est une bactérie anaérobie" },
          { letter: "B", text: "Est présent de façon naturelle dans le follicule pilo-sébacé" },
          { letter: "C", text: "Possède une activité pro-inflammatoire" },
          { letter: "D", text: "Peut être éradiqué par des cures cycliques de peroxyde de benzoyle au niveau des zones séborrhéiques" }
        ]
      },
      {
        text: "Le reflux gastro-œsophagien peut se compliquer par (cocher la réponse fausse) :",
        choices: [
          { letter: "A", text: "Œsophage de Barret" },
          { letter: "B", text: "Cancer de l'œsophage" },
          { letter: "C", text: "Sténose peptique" },
          { letter: "D", text: "Méga œsophage" }
        ]
      },
      {
        text: "les principaux causes de la cirrhose hépatique sont ( la RF ) :",
        choices: [
          { letter: "A", text: "Un régime alimentaire riche en vitamine C" },
          { letter: "B", text: "Une hépatite virale chronique B ou C" },
          { letter: "C", text: "Une consommation excessive de l'alcool" },
          { letter: "D", text: "Une stéatose hépatique non alcoolique" }
        ]
      },
      {
        text: "Une diarrhée chronique organique (choisir la réponse fausse) :",
        choices: [
          { letter: "A", text: "Peut être nocturne" },
          { letter: "B", text: "Évoque la cause d'un intestin court" },
          { letter: "C", text: "Peut être provoquée par une prise d'antimicrobiens" },
          { letter: "D", text: "La malabsorption est une de ses causes" }
        ]
      },
      {
        text: "L'eczéma de contact allergique professionnel se caractérise par :",
        choices: [
          { letter: "A", text: "L'absence de sensibilisation préalable" },
          { letter: "B", text: "Une survenue immédiate dès la première exposition" },
          { letter: "C", text: "Des lésions qui peuvent atteindre le siège de contact" },
          { letter: "D", text: "Une guérison toujours complète à l'arrêt d'exposition" }
        ]
      },
      {
        text: "Parmi ces signes cliniques, lequel n'est pas typique de l'intoxication chronique au benzène ?",
        choices: [
          { letter: "A", text: "Asthénie" },
          { letter: "B", text: "Infections récidivantes" },
          { letter: "C", text: "Ictère" },
          { letter: "D", text: "Tendance hémorragique" }
        ]
      },
      {
        text: "Pour qu'un accident du travail soit reconnu par la Caisse Nationale d'Assurance Sociale (CNAS), il faut :",
        choices: [
          { letter: "A", text: "Que la victime soit assurée à la CNAS" },
          { letter: "B", text: "Que l'accident survienne sur le lieu du travail ou lors du trajet domicile-travail" },
          { letter: "C", text: "Que la victime ait été formée aux risques professionnels" },
          { letter: "D", text: "Que la victime ait au moins un mois d'exercice professionnel" }
        ]
      },
      {
        text: "La prise en charge d'une bronchectasie dans sa forme cylindrique bilatérale nécessite :",
        choices: [
          { letter: "A", text: "Un traitement chirurgical" },
          { letter: "B", text: "Des mucolytiques" },
          { letter: "C", text: "Des bronchodilatateurs lorsqu'un déficit ventilatoire obstructif réversible est associé" },
          { letter: "D", text: "Des corticoïdes inhalés" }
        ]
      },
      {
        text: "Quels sont les critères en faveur de la pneumopathie à Legionella pneumophila ?",
        choices: [
          { letter: "A", text: "L'exposition à l'eau" },
          { letter: "B", text: "La confusion" },
          { letter: "C", text: "Les signes digestifs" },
          { letter: "D", text: "L'amoxicilline est le traitement de choix" }
        ]
      },
      {
        text: "Devant la constatation d'adénopathies médiastinales calcifiées en coquille d'œuf, quel est le premier diagnostic à évoquer ?",
        choices: [
          { letter: "A", text: "Tuberculose ganglionnaire" },
          { letter: "B", text: "Silicose" },
          { letter: "C", text: "Sarcoïdose" },
          { letter: "D", text: "Métastase ganglionnaire" }
        ]
      },
      {
        text: "L'aspect radiologique évocateur d'une TBC pulmonaire: cochez-la ou les réponse(s) juste(s)",
        choices: [
          { letter: "A", text: "Les images nodulaires" },
          { letter: "B", text: "Les infiltrats" },
          { letter: "C", text: "Opacités excavées" },
          { letter: "D", text: "Image en Os de sèche" }
        ]
      },
      {
        text: "Quelle est l'éthologie la plus fréquente d'un angor d'effort",
        choices: [
          { letter: "A", text: "Les vascularites inflammatoires (Kawasaki, Takayashu)" },
          { letter: "B", text: "L'angor fonctionnel (anémie sévère, état de choc)" },
          { letter: "C", text: "L'athérosclérose" },
          { letter: "D", text: "Coronarite radique" }
        ]
      },
      {
        text: "La prescription médicamenteuse à privilégier chez un hypertendu avec hypertrophie ventriculaire gauche est :",
        choices: [
          { letter: "A", text: "IEC + bétabloqueur" },
          { letter: "B", text: "ARA II + bétabloqueur" },
          { letter: "C", text: "ARA II + diurétique" },
          { letter: "D", text: "Bétabloqueur + diurétique" }
        ]
      },
      {
        text: "Parmi ces signes auscultatoires d'un patient présentant une insuffisance mitrale, Cocher la RF",
        choices: [
          { letter: "A", text: "Souffle systolique apexien, holosystolique, doux en jet de vapeur, irradiant à l'aisselle" },
          { letter: "B", text: "Éclat de B2" },
          { letter: "C", text: "Éclat de B1" },
          { letter: "D", text: "Bruit de galop droit" }
        ]
      },
      {
        text: "Parmi les complications suivantes, laquelle ne s'observe pas au cours du rétrécissement mitral ?",
        choices: [
          { letter: "A", text: "Un œdème aigu du poumon" },
          { letter: "B", text: "Une embolie pulmonaire" },
          { letter: "C", text: "Une fibrillation auriculaire" },
          { letter: "D", text: "Une tachycardie ventriculaire" }
        ]
      },
      {
        text: "La peur de commettre des actes sacrilèges au cours d'un office religieux est caractéristique de :",
        choices: [
          { letter: "A", text: "L'agoraphobie" },
          { letter: "B", text: "La phobie sociale" },
          { letter: "C", text: "La névrose d'impulsion" },
          { letter: "D", text: "La discordance" }
        ]
      },
      {
        text: "Tous les diagnostics différentiels sont retrouvés dans la psychose hallucinatoire chronique, sauf un, lequel ?",
        choices: [
          { letter: "A", text: "Les toxicomanies" },
          { letter: "B", text: "L'état de stress post traumatique" },
          { letter: "C", text: "L'état de dépersonnalisation d'origine toxique" },
          { letter: "D", text: "Les psychoses aiguës et chroniques" }
        ]
      },
      {
        text: "L'examen clinique d'une épaule douloureuse par tendinite simple du sus-épineux montre :",
        choices: [
          { letter: "A", text: "Une limitation de l'abduction active" },
          { letter: "B", text: "Une limitation de l'abduction passive" },
          { letter: "C", text: "Une douleur à l'abduction contrariée" },
          { letter: "D", text: "Une douleur en antépulsion et rotation interne" }
        ]
      },
      {
        text: "Concerne la polyarthrite rhumatoïde",
        choices: [
          { letter: "A", text: "Chez la femme, la grossesse est une période de protection vis-à-vis des poussées de la PR." },
          { letter: "B", text: "Le gène codant l'antigène HLA de classe II DR2 est le principal gène de susceptibilité de la PR." },
          { letter: "C", text: "Le tabac est associé aux formes sévères de PR par la présence du facteur rhumatoïde." },
          { letter: "D", text: "La PR est rare chez les hommes âgés." }
        ]
      },
      {
        text: "Concerne la maladie de Guillaume de Boulogne",
        choices: [
          { letter: "A", text: "Une perte de la marche à partir de l'âge de 20 ans" },
          { letter: "B", text: "………………………………………………….." },
          { letter: "C", text: "Une pseudo-hypertrophie des mollets" },
          { letter: "D", text: "Une démarche dandinante" }
        ]
      },
      {
        text: "Concerne la maladie de Charcot-Marie-Tooth",
        choices: [
          { letter: "A", text: "Une amyotrophie en jarretière" },
          { letter: "B", text: "………………." },
          { letter: "C", text: "Un steppage" },
          { letter: "D", text: "Une paralysie faciale périphérique" }
        ]
      },
      {
        text: "Les formes les plus fréquentes de neuropathies diabétiques sont :",
        choices: [
          { letter: "A", text: "La neuropathie motrice proximale" },
          { letter: "B", text: "La neuropathie sensitive distale" },
          { letter: "C", text: "La neuropathie sensitivo-motrice" },
          { letter: "D", text: "Les polyradiculo-neuropathies" }
        ]
      },
      {
        text: "Lors d'une intoxication au paracétamol, quelles sont les mesures thérapeutiques ?",
        choices: [
          { letter: "A", text: "Lavage gastrique même après 48h" },
          { letter: "B", text: "Administration orale de N-acétylcystéine" },
          { letter: "C", text: "Apport de sodium" },
          { letter: "D", text: "Administration IV de N-acétylcystéine" }
        ]
      },
      {
        text: "Le choc cardiogénique sur insuffisance cardiaque droite associe les signes suivants :",
        choices: [
          { letter: "A", text: "Les signes de choc" },
          { letter: "B", text: "Des râles crépitants" },
          { letter: "C", text: "Une turgescence des jugulaires" },
          { letter: "D", text: "Une PVC basse" }
        ]
      },
      {
        text: "Concernant l'intoxication aiguë par le monoxyde de carbone (CO) :",
        choices: [
          { letter: "A", text: "Les intoxications sont souvent liées à un fonctionnement défectueux d'un appareil de chauffage" },
          { letter: "B", text: "Le CO est capable de se fixer sur la myoglobine" },
          { letter: "C", text: "Le CO est l'un des principaux gaz produits retrouvés dans les gaz d'incendies" },
          { letter: "D", text: "Le CO peut être adsorbé par le charbon activé" }
        ]
      },
      {
        text: "Parmi les symptômes suivants, lequel est absent lors d'une intoxication aiguë au CO ?",
        choices: [
          { letter: "A", text: "Dyspnée" },
          { letter: "B", text: "Céphalées" },
          { letter: "C", text: "Coma" },
          { letter: "D", text: "Vertiges" }
        ]
      },
      {
        text: "Parmi les signes cliniques d'une hyponatrémie, on note :",
        choices: [
          { letter: "A", text: "Une soif intense" },
          { letter: "B", text: "Des troubles de la conscience" },
          { letter: "C", text: "……………………….." },
          { letter: "D", text: "Une hypothermie d'origine centrale" }
        ]
      },
      {
        text: "La prise en charge d'un SCA ST+ est basée sur :",
        choices: [
          { letter: "A", text: "La réalisation d'un ECG de surface" },
          { letter: "B", text: "Le dosage des troponines" },
          { letter: "C", text: "La connaissance de l'heure du début des symptômes" },
          { letter: "D", text: "Le dosage systématique des D-dimères" }
        ]
      },
      {
        text: "L'hyponatrémie :",
        choices: [
          { letter: "A", text: "Est un désordre hydro-électrolytique rare" },
          { letter: "B", text: "Se définit par une natrémie inférieure à 145 mmol/L" },
          { letter: "C", text: "Est le plus souvent modéré et asymptomatique" },
          { letter: "D", text: "N'a pas de conséquences graves" }
        ]
      },
      {
        text: "Certaines localisations particulières des brûlures sont à rechercher, lesquelles ?",
        choices: [
          { letter: "A", text: "Brûlures de la face" },
          { letter: "B", text: "Brûlures du périnée" },
          { letter: "C", text: "Brûlures du dos" },
          { letter: "D", text: "Brûlures des jambes" }
        ]
      },
      {
        text: "L'insuline rapide peut être administrée par :",
        choices: [
          { letter: "A", text: "Voie sous-cutanée" },
          { letter: "B", text: "Voie intradermique" },
          { letter: "C", text: "Voie intra-veineuse" },
          { letter: "D", text: "Voie nasale" }
        ]
      },
      {
        text: "Les principales complications de l'insulinothérapie sont :",
        choices: [
          { letter: "A", text: "L'hypernatrémie" },
          { letter: "B", text: "Les lipodystrophies" },
          { letter: "C", text: "L'allergie" },
          { letter: "D", text: "La neuropathie périphérique" }
        ]
      },
      {
        text: "Parmi les critères suivants, lequel est le plus fiable pour différencier une insuffisance rénale aiguë d'une insuffisance rénale chronique ?",
        choices: [
          { letter: "A", text: "L'hyperphosphatémie" },
          { letter: "B", text: "L'anémie" },
          { letter: "C", text: "L'hyperuricémie" },
          { letter: "D", text: "La mesure de la taille des reins" }
        ]
      },
      {
        text: "Devant toute insuffisance rénale aiguë, quels sont les examens utiles en urgence ?",
        choices: [
          { letter: "A", text: "L'ECG" },
          { letter: "B", text: "Le fond d'œil" },
          { letter: "C", text: "Le frottis sanguin" },
          { letter: "D", text: "L'échographie rénale" }
        ]
      },
      {
        text: "Lors de l'élaboration d'un objectif d'un programme de santé, la pertinence signifie :",
        choices: [
          { letter: "A", text: "Que l'objectif se rapporte réellement au problème de santé" },
          { letter: "B", text: "……………………………." },
          { letter: "C", text: "Que l'objectif n'a pu être atteint par ……………….." },
          { letter: "D", text: "Que le problème considéré n'est pas responsable par manque de données" }
        ]
      },
      {
        text: "L'étendue d'une série statistique est:",
        choices: [
          { letter: "A", text: "Est l'écart entre le quartile supérieur et la limite inférieure d'une classe" },
          { letter: "B", text: "La différence entre le 3ème et le premier quartile" },
          { letter: "C", text: "Est l'écart entre la valeur maximale et la valeur minimale d'une série de données" },
          { letter: "D", text: "La différence entre le 3ème et le 1er décile" }
        ]
      },
      {
        text: "L'activité économique est définie comme :",
        choices: [
          { letter: "A", text: "La production de biens et services" },
          { letter: "B", text: "La production de biens et services pour répondre à une demande" },
          { letter: "C", text: "La production de biens et services à partir du diagnostic établi de besoins" },
          { letter: "D", text: "Un cycle de production, de distribution-commercialisation et de consommation" }
        ]
      },
      {
        text: "Les personnes devraient être traitées de la même manière si elles ont un problème similaire, peu importe leur origine sociale ou géographique et leur salaire. Ceci répond à la définition de :",
        choices: [
          { letter: "A", text: "L'équité horizontale" },
          { letter: "B", text: "L'équité verticale" },
          { letter: "C", text: "L'équité horizontale plus l'équité verticale" },
          { letter: "D", text: "Aucune réponse n'est juste" }
        ]
      },
      {
        text: "Le syndrome de l'enfant secoué englobe :",
        choices: [
          { letter: "A", text: "Des lésions hémorragiques sous-durales" },
          { letter: "B", text: "De multiples fractures symétriques" },
          { letter: "C", text: "Des caillots sanguins au vertex" },
          { letter: "D", text: "Des lacérations pulmonaires" }
        ]
      },
      {
        text: "Le viol est un crime punissable par le code pénal dans son article :",
        choices: [
          { letter: "A", text: "L'article 336" },
          { letter: "B", text: "L'article 333" },
          { letter: "C", text: "L'article 334" },
          { letter: "D", text: "L'article 335" }
        ]
      },
      {
        text: "Parmi les situations où les certificats médicaux peuvent être délivrés à une tierce personne, nous pouvons citer :",
        choices: [
          { letter: "A", text: "Le syndrome d'immunodéficience acquise" },
          { letter: "B", text: "La cure de désintoxication" },
          { letter: "C", text: "Les sévices des personnes handicapées" },
          { letter: "D", text: "Coups et blessures volontaires d'un sujet adulte" }
        ]
      },
      {
        text: "Viole le secret professionnel, le médecin qui :",
        choices: [
          { letter: "A", text: "Communique à un tiers les clichés radiologiques d'un de ses patients" },
          { letter: "B", text: "Délivre en main propre un certificat à son patient pour une compagnie d'assurance" },
          { letter: "C", text: "Indique le nom d'un de ses patients dans une publication scientifique" },
          { letter: "D", text: "Dénonce au procureur de la république l'auteur d'un crime" }
        ]
      },
      {
        text: "[concerne l'insulinothérapie ou le diabète]",
        choices: [
          { letter: "A", text: "Nécessite des doses d'insuline inférieures à celles des enfants impubères" },
          { letter: "B", text: "Nécessite des doses d'insuline supérieures à celles des enfants impubères" },
          { letter: "C", text: "Se caractérise par l'augmentation de l'insulino-résistance" },
          { letter: "D", text: "Les complications métaboliques aiguës sont plus fréquentes" }
        ]
      },
      {
        text: "Concerne les convulsions hyperthermiques",
        choices: [
          { letter: "A", text: "Elles surviennent avant l'âge de trois mois" },
          { letter: "B", text: "La fièvre est déterminée par rapport à une infection méningée" },
          { letter: "C", text: "La durée de la crise est souvent supérieure à 20 minutes" },
          { letter: "D", text: "Aucune réponse n'est juste" }
        ]
      },
      {
        text: "Le traitement de la malnutrition protéino-énergétique consiste à :",
        choices: [
          { letter: "A", text: "Stabilisation et réhydratation sur 24 heures" },
          { letter: "B", text: "Réalimentation par des régimes délétères hypercaloriques hyperprotidiques durant la première semaine de traitement" },
          { letter: "C", text: "Prescription des diurétiques associés aux digitaliques en présence d'une insuffisance cardiaque" },
          { letter: "D", text: "Correction des troubles hydro-électrolytiques avant l'instauration du programme de réalimentation" }
        ]
      },
      {
        text: "Duran le traitement de l'acidocétose diabétique, toutes les complications suivantes peuvent se voir sauf une, laquelle ?",
        choices: [
          { letter: "A", text: "Un œdème cérébral" },
          { letter: "B", text: "Une hyperglycémie" },
          { letter: "C", text: "Une hypokaliémie" },
          { letter: "D", text: "Une hypoglycémie" }
        ]
      },
      {
        text: "Parmi les signes de développements psychomoteurs suivants, un est pathologique. Lequel ?",
        choices: [
          { letter: "A", text: "Peur des visages étrangers à l'âge de 10 mois" },
          { letter: "B", text: "Position assise sans appui à l'âge de 8 mois" },
          { letter: "C", text: "Marche à l'âge de 24 mois" },
          { letter: "D", text: "Tenue de la tête à l'âge de 3 mois" }
        ]
      }
    ];

    // 5️⃣ Insert all questions with proper indexing and reference to residency
    const insertedQuestions = [];
    for (const question of questions) {
      const newQuestion = new ResidencyQuestion({
        residency: savedResidency._id,
        text: question.text,
        choices: question.choices,
        correctAnswers: [], // Empty array as requested
        index: questionIndex++,
      });

      const savedQuestion = await newQuestion.save();
      insertedQuestions.push(savedQuestion);
    }

    console.log(`✅ Successfully inserted ${insertedQuestions.length} questions`);
    console.log("📋 Residency ID:", savedResidency._id);
    console.log("📋 Residency Index:", savedResidency.index);
    console.log("📋 Questions index range: 1 to", questionIndex - 1);

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    // 6️⃣ Close connection
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
  }
}

// Run the script
insertData();