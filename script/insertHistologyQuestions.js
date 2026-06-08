require('dotenv').config();
const mongoose = require('mongoose');
const Residency = require('../models/residency');
const ResidencyQuestion = require('../models/residencyQuestion');

const questionsData = [
  {
    text: "A quelle formation histologique correspond le plexus de Meissner? ( RESIDANAT 2025 )",
    choices: [
      { letter: "A", text: "Formation lymphoïde de la sous muqueuse" },
      { letter: "B", text: "Formation nerveuse de la sous muqueuse" },
      { letter: "C", text: "Formation nerveuse de la sous muqueuse" },
      { letter: "D", text: "Formation vasculaire de la sous muqueuse" }
    ],
    correctAnswers: ["B"]
  },
  {
    text: "Concernant les cellules glandulaires de l'adénohypophyse, elles : ( RESIDANAT 2025 )",
    choices: [
      { letter: "A", text: "Sont contrôlées par les noyaux parvi-cellulaires" },
      { letter: "B", text: "Se disposent en placards et en amas cellulaires" },
      { letter: "C", text: "Sont révélées uniquement par coloration ordinaire" },
      { letter: "D", text: "Sécrètent parfois un précurseur de plusieurs hormones" }
    ],
    correctAnswers: ["A", "D"]
  },
  {
    text: "L'ultrastructure du pneumocyte membraneux permet de voir ( RESIDANAT 2025 )",
    choices: [
      { letter: "A", text: "Des microvillosités au pôle apical" },
      { letter: "B", text: "De nombreux grains de sécrétion" },
      { letter: "C", text: "Un voile cytoplasmique étalé" },
      { letter: "D", text: "Des vésicules de pinocytose" }
    ],
    correctAnswers: ["C", "D"]
  },
  {
    text: "La paroi épithéliale de la glande pylorique se distingue de la paroi fundique par l'absence de : ( RESIDANAT 2024 )",
    choices: [
      { letter: "A", text: "Cellules pariétales" },
      { letter: "B", text: "Cellules argentaffines" },
      { letter: "C", text: "Cellules principales" },
      { letter: "D", text: "Cellules muqueuses" }
    ],
    correctAnswers: ["A"]
  },
  {
    text: "Cellules ne participe pas à la formation de l'épithélium pylorique : ( RESIDANAT 2024 )",
    choices: [
      { letter: "A", text: "Cellules muqueuses" },
      { letter: "B", text: "Cellules pariétales" },
      { letter: "C", text: "Cellules G" },
      { letter: "D", text: "Cellules principales" }
    ],
    correctAnswers: ["B"]
  },
  {
    text: "Sur un ME les cellules pariétales des glandes fundiques présentes les caractéristiques suivantes : ( RESIDANAT 2024 )",
    choices: [
      { letter: "A", text: "Chorion développé" },
      { letter: "B", text: "Réseau canaliculaire intra cellulaire" },
      { letter: "C", text: "Système tubulo-vésicule" },
      { letter: "D", text: "-----------------------" }
    ],
    correctAnswers: ["B", "C"]
  },
  {
    text: "le corps cellulaire de la post hypophyse ( RESIDANAT 2023 )",
    choices: [
      { letter: "A", text: "--------------------------" },
      { letter: "B", text: "inhibiteur" },
      { letter: "C", text: "paro" },
      { letter: "D", text: "magno" }
    ],
    correctAnswers: ["D"]
  },
  {
    text: "ovogenèse ( RESIDANAT 2023 )",
    choices: [
      { letter: "A", text: "avant la naissance" },
      { letter: "B", text: "après la naissance" },
      { letter: "C", text: "naissance – puberté" },
      { letter: "D", text: "--------------------------" }
    ],
    correctAnswers: ["A"]
  },
  {
    text: "villosité intestinale (RF) ( RESIDANAT 2023 )",
    choices: [
      { letter: "A", text: "TC lâche" },
      { letter: "B", text: "capillaire sanguin" },
      { letter: "C", text: "muscle strié Bruck" },
      { letter: "D", text: "--------------------------" }
    ],
    correctAnswers: ["A", "B", "C"]
  },
  {
    text: "la muqueuse de l'estomac : ( RESIDANAT 2022 )",
    choices: [
      { letter: "A", text: "Est faite d'un épithélium prismatique surtout son étendu" },
      { letter: "B", text: "Est faite d'un épithélium pavimenteux au niveau du cardia et prismatique dans le reste" },
      { letter: "C", text: "Est faite d'un épithélium a cellules calciformes" },
      { letter: "D", text: "Epithélium a cellules a pole muqueux fermé" }
    ],
    correctAnswers: ["A"]
  },
  {
    text: "l'axe de la villosité intestinale contient : ( RESIDANAT 2022 )",
    choices: [
      { letter: "A", text: "Des fibres élastiques" },
      { letter: "B", text: "Des formations lymphoides" },
      { letter: "C", text: "Du muscle strié" },
      { letter: "D", text: "Un chylifère central" }
    ],
    correctAnswers: ["A", "B", "D"]
  },
  {
    text: "Les cellules de Paneth contrôlent la flore bactérienne commensale et pathogène par la sécrétion des produits suivants ( RESIDANAT 2022 )",
    choices: [
      { letter: "A", text: "Les défensines." },
      { letter: "B", text: "Les lysozymes." },
      { letter: "C", text: "Le facteur de nécrose tumorale alpha (TNF-alpha)." },
      { letter: "D", text: "Les endopeptidases." }
    ],
    correctAnswers: ["A", "B"]
  },
  {
    text: "Les macrophages alvéolaires sont : ( RESIDANAT 2022 )",
    choices: [
      { letter: "A", text: "Libres dans la cavité alvéolaire." },
      { letter: "B", text: "Libres dans l'espace septal." },
      { letter: "C", text: "Riches en phagolysosomes." },
      { letter: "D", text: "D'origine monocytaire." }
    ],
    correctAnswers: ["A", "C", "D"]
  },
  {
    text: "Les spermatozoïdes des voies spermatiques intra-testiculaires : ( RESIDANAT 2022 )",
    choices: [
      { letter: "A", text: "Sont matures et immobiles." },
      { letter: "B", text: "Sont immobiles et immatures." },
      { letter: "C", text: "Ont une progression assurée par le liquide séminal primitif." },
      { letter: "D", text: "Sont poussés par les battements des cils." }
    ],
    correctAnswers: ["B", "C"]
  },
  {
    text: "Le mésothélium se trouve dans ( RESIDANAT 2021 )",
    choices: [
      { letter: "A", text: "Le péritoine." },
      { letter: "B", text: "Les bronches." },
      { letter: "C", text: "Le pancréas." },
      { letter: "D", text: "Les ovaires." }
    ],
    correctAnswers: ["A"]
  },
  {
    text: "La spermatogenèse : ( RESIDANAT 2021 )",
    choices: [
      { letter: "A", text: "Spermatogonie diploïde." },
      { letter: "B", text: "Spermatogonie haploïde." },
      { letter: "C", text: "Spermatogonie donne 16 spermatozoïdes." },
      { letter: "D", text: "Passe par plusieurs étapes." }
    ],
    correctAnswers: ["A", "D"]
  },
  {
    text: "La spermatogenèse régulée par : ( RESIDANAT 2021 )",
    choices: [
      { letter: "A", text: "FSH seulement." },
      { letter: "B", text: "LH seulement." },
      { letter: "C", text: "FSH-LH." },
      { letter: "D", text: "-" }
    ],
    correctAnswers: ["C"]
  },
  {
    text: "La spermatogénèse dure chez l'homme ( RESIDANAT 2019 )",
    choices: [
      { letter: "A", text: "100 jours." },
      { letter: "B", text: "74 jours." },
      { letter: "C", text: "94 jours." },
      { letter: "D", text: "50 jours." }
    ],
    correctAnswers: ["B"]
  },
  {
    text: "La régulation des fonctions des tubes séminifères est assurée par : ( RESIDANAT 2019 )",
    choices: [
      { letter: "A", text: "Les deux hormones hypophysaires : FSH et LH." },
      { letter: "B", text: "Uniquement par la FSH." },
      { letter: "C", text: "Uniquement par la LH." },
      { letter: "D", text: "D Aucune hormone hypophysaire." }
    ],
    correctAnswers: ["A"]
  },
  {
    text: "La testostérone : ( RESIDANAT 2019 )",
    choices: [
      { letter: "A", text: "Stimule l'activité de cellules de sertoli." },
      { letter: "B", text: "Stimule la spermatogénèse." },
      { letter: "C", text: "Est sécrétée par les cellules de leydig." },
      { letter: "D", text: "Aucune proposition n'est juste." }
    ],
    correctAnswers: ["A", "B", "C"]
  },
  {
    text: "Les voies spermatiques intra-testiculaires sont : ( RESIDANAT 2019 )",
    choices: [
      { letter: "A", text: "Rete testis et cônes efférents." },
      { letter: "B", text: "Des simples voles vectrices du sperme." },
      { letter: "C", text: "Canal déférent et Rete testis." },
      { letter: "D", text: "Le Rete testis et les tubes droits." }
    ],
    correctAnswers: ["D"]
  },
  {
    text: "Le canal épididymaire est tapissé par un épithélium: ( RESIDANAT 2019 )",
    choices: [
      { letter: "A", text: "De type malpighien." },
      { letter: "B", text: "Prismatique simple." },
      { letter: "C", text: "Pavimenteux." },
      { letter: "D", text: "Cubique." }
    ],
    correctAnswers: ["B"]
  },
  {
    text: "Les cellules germinales subissent des divisions métotiques. Quelles sont les cellules diploïdes parmi les suivantes ? ( RESIDANAT 2014)",
    choices: [
      { letter: "A", text: "Spermatide." },
      { letter: "B", text: "Spermatocyte II." },
      { letter: "C", text: "Spermatogonie." },
      { letter: "D", text: "Ovotide." }
    ],
    correctAnswers: ["C"]
  },
  {
    text: "L'épithélium de type épidermoïde s'observe au niveau du tractus génital. Quelle est la proposition juste ? ( RESIDANAT 2014)",
    choices: [
      { letter: "A", text: "C'est l'épithélium de l'endocol." },
      { letter: "B", text: "C'est l'épithélium du vagin." },
      { letter: "C", text: "Ses cellules sont sécrétrices." },
      { letter: "D", text: "C'est un épithélium glandulaire." }
    ],
    correctAnswers: ["B"]
  },
  {
    text: "Après maturation, les spermatozoïdes sont stockés avant leur expulsion. Le lieu du stockage est : ( RESIDANAT 2014)",
    choices: [
      { letter: "A", text: "Le canal déférent." },
      { letter: "B", text: "Le canal éjaculateur." },
      { letter: "C", text: "L'ampoule déférentielle." },
      { letter: "D", text: "La queue de l'épididyme." }
    ],
    correctAnswers: ["D"]
  },
  {
    text: "Le corps Jaune progestatif est formé après l'ovulation, il disparait à la fin : ( RESIDANAT 2014)",
    choices: [
      { letter: "A", text: "De la première semaine de la grossesse." },
      { letter: "B", text: "Des deux premières semaines de la grossesse." },
      { letter: "C", text: "De la 2e partie du cycle menstruel." },
      { letter: "D", text: "Du premier trimestre de la grossesse." }
    ],
    correctAnswers: ["D"]
  },
  {
    text: "Dans le stroma cortical ovarien, certains follicules sont involutifs. Lequel est involutif parmi les suivants? ( RESIDANAT 2014)",
    choices: [
      { letter: "A", text: "Le follicule primaire." },
      { letter: "B", text: "Le follicule gamétogène." },
      { letter: "C", text: "Le follicule atrétique." },
      { letter: "D", text: "Le follicule secondaire." }
    ],
    correctAnswers: ["C"]
  },
  {
    text: "à propos des glandes annexes des voies génitales masculines. Quelle est la proposition vraie : ( RESIDANAT 2014)",
    choices: [
      { letter: "A", text: "Le liquide séminal est riche en phosphatases acides." },
      { letter: "B", text: "Le liquide séminal est riche en fructose." },
      { letter: "C", text: "Le liquide prostatique est alcalin." },
      { letter: "D", text: "Les glandes bulbo-urétrales secrètent des protéines." }
    ],
    correctAnswers: ["B"]
  },
  {
    text: "Avant élimination, les spermatozoïdes cheminent dans les différentes voles excrétrices. A la sortie des cônes efférents, les spermatozoïdes sont : ( RESIDANAT 2014)",
    choices: [
      { letter: "A", text: "Mobiles, Immatures." },
      { letter: "B", text: "Mobiles, matures." },
      { letter: "C", text: "Immobiles, Immatures." },
      { letter: "D", text: "Immobiles, matures." }
    ],
    correctAnswers: ["C"]
  },
  {
    text: "Les cellules responsables de la synthèse de la testostérone sont : ( RESIDANAT 2014)",
    choices: [
      { letter: "A", text: "Les cellules glandulaires vésiculaires." },
      { letter: "B", text: "Les cellules de Sertoli." },
      { letter: "C", text: "Les cellules germinales." },
      { letter: "D", text: "Les cellules interstitielles." }
    ],
    correctAnswers: ["D"]
  },
  {
    text: "Les cellules glandulaires de l'ovaire sont responsables en partie de la sécrétion de la progesterone. Ces cellules sont caractérisées par : ( RESIDANAT 2014)",
    choices: [
      { letter: "A", text: "Un réticulum endoplasmique granulaire abondant." },
      { letter: "B", text: "Des liposomes abondants." },
      { letter: "C", text: "Des mitochondries rares." },
      { letter: "D", text: "La présence de vésicules de sécrétion." }
    ],
    correctAnswers: ["A", "B", "D"]
  },
  {
    text: "Le liquide séminal primitif est secrété par : ( RESIDANAT 2014)",
    choices: [
      { letter: "A", text: "Les cellules du rete testis." },
      { letter: "B", text: "Les cellules de Sertoli." },
      { letter: "C", text: "Les cellules glandulaires du canal épididymaire." },
      { letter: "D", text: "Les cellules glandulaires des cônes efférents." }
    ],
    correctAnswers: ["B"]
  },
  {
    text: "L'ovogenèse est le processus aboutissant à la production des gamètes femelles. L'ovogenèse se caractérise par ( RESIDANAT 2014)",
    choices: [
      { letter: "A", text: "Son début après la naissance." },
      { letter: "B", text: "Son début à la puberté." },
      { letter: "C", text: "Son caractère continu avant la puberté." },
      { letter: "D", text: "Son caractère continu après la puberté." }
    ],
    correctAnswers: ["D"]
  }
];

async function insertHistologyQuestions() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'doctoryQcm',
    });
    console.log("✅ Connected to MongoDB\n");

    const moduleId = "658607c79067bf3461bb3f3d";

    // Check if residency for this module already exists
    let residency = await Residency.findOne({ 
      module: moduleId,
      type: "module",
      name: "Histologie"
    });

    // If not, create a new residency
    if (!residency) {
      residency = new Residency({
        name: "Histologie",
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
      console.log(`   Choices: ${q.choices.length}, Correct: [${q.correctAnswers.join(', ')}]\n`);
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

insertHistologyQuestions();