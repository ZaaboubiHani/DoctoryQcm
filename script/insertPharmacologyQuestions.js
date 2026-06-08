require('dotenv').config();
const mongoose = require('mongoose');
const Residency = require('../models/residency');
const ResidencyQuestion = require('../models/residencyQuestion');

const questionsData = [
  {
    text: "Prodrogue (promédicament) ( RESIDANAT 2024 )",
    choices: [
      { letter: "A", text: "Est efficace avant biotransformation" },
      { letter: "B", text: "N'est actif qu'après biotransformation" },
      { letter: "C", text: "Psychotrope hallucinogène" },
      { letter: "D", text: "Métabolite inactif" }
    ],
    correctAnswers: [] // No * indicators in the original
  },
  {
    text: "Les molécules qui augmente leur effet de manière multiplie: ( RESIDANAT 2024 )",
    choices: [
      { letter: "A", text: "effet égale à la somme des effets séparés" },
      { letter: "B", text: "met en jeu des cibles cellulaire identique" },
      { letter: "C", text: "synergie potentialisateice" },
      { letter: "D", text: "synergie additive" }
    ],
    correctAnswers: [] // No * indicators in the original
  },
  {
    text: "Un effecteur peut être (RF) ( RESIDANAT 2024 )",
    choices: [
      { letter: "A", text: "Récepteur inotrope" },
      { letter: "B", text: "Protéine G" },
      { letter: "C", text: "Hormone" },
      { letter: "D", text: "Substance activatrice ou inhibitrice" }
    ],
    correctAnswers: [] // No * indicators in the original
  },
  {
    text: "10 parmi les proteines plasmatiques, laquelle est la plus polyvalente dans la fixation des médicaments ( RESIDANAT 2022 )",
    choices: [
      { letter: "A", text: "Les lipoprotéines" },
      { letter: "B", text: "L'alpha 1glycoprotéines acide" },
      { letter: "C", text: "Globuline" },
      { letter: "D", text: "Albumine" }
    ],
    correctAnswers: [] // No * indicators in the original
  },
  {
    text: "11 lequel de ces médicaments n'est pas un inducteur ( RESIDANAT 2022 )",
    choices: [
      { letter: "A", text: "Rifampicine" },
      { letter: "B", text: "Carmazipine" },
      { letter: "C", text: "Aspirine" },
      { letter: "D", text: "Phenytoine" }
    ],
    correctAnswers: [] // No * indicators in the original
  },
  {
    text: "12| les réactions immuno allergiques aux médicaments : ( RESIDANAT 2022 )",
    choices: [
      { letter: "A", text: "Nécessitent une administration antérieur du médicament en cause" },
      { letter: "B", text: "Sont d'apparition prévisible" },
      { letter: "C", text: "Apparaissent dès la première administration du medicament" },
      { letter: "D", text: "Ont toute le même mécanisme humoral et cellulaire" }
    ],
    correctAnswers: [] // No * indicators in the original
  },
  {
    text: "13 le récepteur couplé à la protéine G: ( RESIDANAT 2022 )",
    choices: [
      { letter: "A", text: "Peut jouer le rôle d'une enzyme" },
      { letter: "B", text: "Et toujours membranaires" },
      { letter: "C", text: "Possède un domaine extracellulaire riche en COOH" },
      { letter: "D", text: "Assure la transmission chimique" }
    ],
    correctAnswers: [] // No * indicators in the original
  },
  {
    text: "14] les facteurs qui augmentent la diffusion à travers la barrière hémato encéphalique ( RESIDANAT 2022 )",
    choices: [
      { letter: "A", text: "Age adulte" },
      { letter: "B", text: "Grossesse" },
      { letter: "C", text: "Méningite" }
    ],
    correctAnswers: [] // No * indicators in the original
  },
  {
    text: "89| Dans le métabolisme des médicaments, les réactions de phase I comprennent: ( RESIDANAT 2022 )",
    choices: [
      { letter: "A", text: "Les réactions d'acétylation." },
      { letter: "B", text: "Les sulfo-conjugaisons." },
      { letter: "C", text: "Les réactions d'amination oxydative." },
      { letter: "D", text: "Les réactions d'oxydation." }
    ],
    correctAnswers: [] // No * indicators in the original
  },
  {
    text: "90| Lors de la distribution du médicament dans l'organisme : ( RESIDANAT 2022 )",
    choices: [
      { letter: "A", text: "Celui-ci atteint de façon irréversible toutes les régions de l'organisme." },
      { letter: "B", text: "Le phénomène commence après que toute la quantité de médicament administrée soit absorbée." },
      { letter: "C", text: "Ce dernier utilise des mécanismes similaires à l'absorption." },
      { letter: "D", text: "Une fois dans le tissu, le médicament n'existe que sous forme libre." }
    ],
    correctAnswers: [] // No * indicators in the original
  },
  {
    text: "91 L'induction enzymatique correspond à la stimulation du métabolisme d'un médicament par un autre dit inducteur. Parm ( RESIDANAT 2022 )",
    choices: [
      { letter: "A", text: "Phenytoines." },
      { letter: "B", text: "Carbamazepine." },
      { letter: "C", text: "Aspirine." },
      { letter: "D", text: "Rifampicine.." }
    ],
    correctAnswers: [] // No * indicators in the original
  },
  {
    text: "92| La sécrétion tubulaire : ( RESIDANAT 2022 )",
    choices: [
      { letter: "A", text: "Est le principal mécanisme d'excrétion des médicaments." },
      { letter: "B", text: "Concerne tous les médicaments éliminés par le rein." },
      { letter: "C", text: "S'effectue uniquement par transport actif." },
      { letter: "D", text: "S'effectue tout au long du néphron." }
    ],
    correctAnswers: [] // No * indicators in the original
  },
  {
    text: "93| Dans le plasma, la forme libre du médicament: ( RESIDANAT 2022 )",
    choices: [
      { letter: "A", text: "Est toujours inférieure en pourcentage à sa forme liée." },
      { letter: "B", text: "Représente la forme pharmacologiquement active." },
      { letter: "C", text: "Est toujours supérieure en pourcentage à sa forme liée." },
      { letter: "D", text: "Est la seule forme qui ne peut pas être éliminée." }
    ],
    correctAnswers: [] // No * indicators in the original
  },
  {
    text: "24| Effet indésirable et effet secondaire, caractère commun : ( RESIDANAT 2021 )",
    choices: [
      { letter: "A", text: "Liée au mécanisme d'action." },
      { letter: "B", text: "Dose dépendant." },
      { letter: "C", text: "Néfaste." },
      { letter: "D", text: "Varié d'une personne à autre." }
    ],
    correctAnswers: [] // No * indicators in the original
  },
  {
    text: "68| La demi-vie plasmatique est le temps nécessaire pour que la concentration plasmatique : ( RESIDANAT 2014)",
    choices: [
      { letter: "A", text: "Double." },
      { letter: "B", text: "Diminue de 25%." },
      { letter: "C", text: "Diminue de 50%." },
      { letter: "D", text: "Devienne indécelable." }
    ],
    correctAnswers: [] // No * indicators in the original
  },
  {
    text: "69❘ l'imputabilité : ( RESIDANAT 2014)",
    choices: [
      { letter: "A", text: "Est l'absence d'un lien de causalité entre le médicament et l'effet indésirable." },
      { letter: "B", text: "Représente une étape importante dans l'activité de la pharmacovigilance." },
      { letter: "C", text: "La mission du ministère de la santé pour donner une décision concernant l'utilisation d'un médicament." },
      { letter: "D", text: "Ne doit pas prendre en compte les Informations établies dans les références bibliographiques." }
    ],
    correctAnswers: [] // No * indicators in the original
  },
  {
    text: "70| Parmi ces évènements, lequel est concerné par la pharmacovigilance ? ( RESIDANAT 2014)",
    choices: [
      { letter: "A", text: "La détection d'une nouvelle Indication thérapeutique (hors AMM)." },
      { letter: "B", text: "L'usage dévié d'un médicament." },
      { letter: "C", text: "La mauvaise qualité pharmaceutique d'un médicament." },
      { letter: "D", text: "La contrefaçon d'un médicament," }
    ],
    correctAnswers: [] // No * indicators in the original
  },
  {
    text: "71| Le passage dans le lait maternel d'un médicament : ( RESIDANAT 2014)",
    choices: [
      { letter: "A", text: "Concerne la fraction liée plasmatique." },
      { letter: "B", text: "Ne présente pas un risque pour le nouveau-né." },
      { letter: "C", text: "S'effectue essentiellement par diffusion passive." },
      { letter: "D", text: "Augmente avec l'hydro solubilité." }
    ],
    correctAnswers: [] // No * indicators in the original
  },
  {
    text: "72| Les molécules acides faibles : ( RESIDANAT 2014)",
    choices: [
      { letter: "A", text: "Se fixent à l'albumine." },
      { letter: "B", text: "Se distribuent au SNC." },
      { letter: "C", text: "S'ionisent au pH gastrique." },
      { letter: "D", text: "Se lient seulement à l'orosomucoide." }
    ],
    correctAnswers: [] // No * indicators in the original
  },
  {
    text: "73❘ Parmi ces facteurs suivants, lequel Influence fortement l'excrétion rénale des médicaments? ( RESIDANAT 2014)",
    choices: [
      { letter: "A", text: "Les interactions médicamenteuses." },
      { letter: "B", text: "Le sexe." },
      { letter: "C", text: "Le polymorphisme génétique." },
      { letter: "D", text: "L'insuffisance hépatique." }
    ],
    correctAnswers: [] // No * indicators in the original
  },
  {
    text: "74| Dans le métabolisme des médicaments, les réactions de phase I comprennent: ( RESIDANAT 2014)",
    choices: [
      { letter: "A", text: "Les réactions d'acétylation." },
      { letter: "B", text: "Les sulfo-conjugaisons." },
      { letter: "C", text: "Les réactions oxydatives." },
      { letter: "D", text: "Les réactions d'oxydation." }
    ],
    correctAnswers: [] // No * indicators in the original
  },
  {
    text: "75 La pharmacovigilance s'intéresse : ( RESIDANAT 2014)",
    choices: [
      { letter: "A", text: "Aux effets indésirables." },
      { letter: "B", text: "A l'efficacité thérapeutique." },
      { letter: "C", text: "Au cout du médicament." },
      { letter: "D", text: "A la mauvaise observance du traitement." }
    ],
    correctAnswers: [] // No * indicators in the original
  },
  {
    text: "76| Le cytachrome P450 est une superfamille d'enzymes impliquées dans les réactions\": ( RESIDANAT 2014)",
    choices: [
      { letter: "A", text: "D'acétylation." },
      { letter: "B", text: "D'oxydations microsomales." },
      { letter: "C", text: "D'oxydations non microsomales." },
      { letter: "D", text: "D'hydrolyse." }
    ],
    correctAnswers: [] // No * indicators in the original
  },
  {
    text: "77| Les étapes mises en jeu dans un système de pharmacovigilance sont : ( RESIDANAT 2014)",
    choices: [
      { letter: "A", text: "La notification, l'évaluation de l'imputabilité, et le retrait du médicament du marché." },
      { letter: "B", text: "La signalisation, le retrait du médicament du marché, et l'enquête orientée." },
      { letter: "C", text: "La notification, l'évaluation de l'imputabilité, et la prise de décision." },
      { letter: "D", text: "Aucune proposition n'est juste." }
    ],
    correctAnswers: [] // No * indicators in the original
  },
  {
    text: "78 l'Imputabilité, dans la pharmacovigilance: ( RESIDANAT 2014)",
    choices: [
      { letter: "A", text: "Est la prise d'une décision finale." },
      { letter: "B", text: "Est la détermination d'une relation cause-effet (médicament-effet indésirable)." },
      { letter: "C", text: "Es la mission du ministère de la santé." },
      { letter: "D", text: "Ne doit pas prendre en compte les informations établies dans la littérature." }
    ],
    correctAnswers: [] // No * indicators in the original
  }
];

async function insertPharmacologyQuestions() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'doctoryQcm',
    });
    console.log("✅ Connected to MongoDB\n");

    const moduleId = "658607c89067bf3461bb55a2";

    // Check if residency for this module already exists
    let residency = await Residency.findOne({ 
      module: moduleId,
      type: "module",
      name: "Pharmacologie"
    });

    // If not, create a new residency
    if (!residency) {
      residency = new Residency({
        name: "Pharmacologie",
        date: new Date(),
        type: "module",
        module: moduleId
      });
      await residency.save();
      console.log(`📚 Created new residency: ${residency.name} (${residency._id})\n`);
    } else {
      console.log(`📚 Found existing residency: ${residency.name} (${residency._id})\n`);
    }

    console.log(`📝 Found ${questionsData.length} questions to insert\n`);

    // Get existing questions count to set proper indices
    const existingCount = await ResidencyQuestion.countDocuments({ 
      residency: residency._id 
    });

    // Delete existing questions for this residency (optional - remove if you want to keep existing ones)
    if (existingCount > 0) {
      console.log(`⚠️  Found ${existingCount} existing questions. They will be kept.`);
      console.log(`   New questions will start at index ${existingCount + 1}\n`);
    }

    // Insert questions
    let insertedCount = 0;
    for (let i = 0; i < questionsData.length; i++) {
      const q = questionsData[i];
      
      const question = new ResidencyQuestion({
        residency: residency._id,
        text: q.text,
        choices: q.choices,
        correctAnswers: q.correctAnswers,
        index: existingCount + i + 1
      });

      await question.save();
      insertedCount++;
      
      console.log(`✅ [${i + 1}/${questionsData.length}] "${q.text.substring(0, 60)}..."`);
      console.log(`   Choices: ${q.choices.length}, Correct: [${q.correctAnswers.join(', ') || 'none'}]\n`);
    }

    console.log(`\n📊 Summary:`);
    console.log(`   - Residency: ${residency.name} (ID: ${residency._id})`);
    console.log(`   - Questions inserted: ${insertedCount}`);
    console.log(`   - Total questions in residency: ${existingCount + insertedCount}`);

    // Disconnect
    await mongoose.disconnect();
    console.log("\n✅ Migration completed successfully!");
  } catch (err) {
    console.error("❌ Error:", err.message);
    console.error(err.stack);
    process.exit(1);
  }
}

insertPharmacologyQuestions();