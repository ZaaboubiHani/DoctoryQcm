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
      name: "Biologie",
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
        text: "Parmi les organes suivants, lequel est le siège d'un carcinome épidermoïde primitif ?",
        choices: [
          { letter: "A", text: "Le foie" },
          { letter: "B", text: "L'estomac" },
          { letter: "C", text: "La peau" },
          { letter: "D", text: "Le cerveau" }
        ]
      },
      {
        text: "La cellule tumorale caractéristique du lymphome de HODGKIN est :",
        choices: [
          { letter: "A", text: "Une cellule macrophagique" },
          { letter: "B", text: "La cellule de Reed Sternberg" },
          { letter: "C", text: "Une cellule fibroblastique" },
          { letter: "D", text: "D'origine épithéliale" }
        ]
      },
      {
        text: "Quelle cellule a la propriété de phagocytose dans l'inflammation :",
        choices: [
          { letter: "A", text: "Macrophage" },
          { letter: "B", text: "Lymphocyte" },
          { letter: "C", text: "Plasmocyte" },
          { letter: "D", text: "Mastocyte" }
        ]
      },
      {
        text: "Le tératome mature :",
        choices: [
          { letter: "A", text: "Est un tumeur germinale rare" },
          { letter: "B", text: "Est une tumeur du blastème la plus fréquente" },
          { letter: "C", text: "Est composé de tissus dérivant des trois feuillets embryonnaires" },
          { letter: "D", text: "Est aussi dysgerminome" }
        ]
      },
      {
        text: "Le lymphome est une tumeur :",
        choices: [
          { letter: "A", text: "De nature mésenchymateuse" },
          { letter: "B", text: "De nature lymphoïde" },
          { letter: "C", text: "De nature épithéliale" },
          { letter: "D", text: "Se développant à partir des cellules lymphoïdes" }
        ]
      },
      {
        text: "La phase d'investissement énergétique de la glycolyse correspond aux cinq premières réactions de la voie. Cette phase enzymatique dissipe :",
        choices: [
          { letter: "A", text: "Consommation d'ATP" },
          { letter: "B", text: "Le glucose est scindé en F1,6 Bis-phosphate" },
          { letter: "C", text: "Le F1,6 Bis-phosphate est scindé en deux trioses" },
          { letter: "D", text: "Production de quatre molécules d'ATP" }
        ]
      },
      {
        text: "Chacune des atteintes suivantes est cause d'une hyperlipoproténimie, sauf une, laquelle ?",
        choices: [
          { letter: "A", text: "Hypocorticisme" },
          { letter: "B", text: "Hypothyroïdie" },
          { letter: "C", text: "Syndrome néphrotique" },
          { letter: "D", text: "Cholestase" }
        ]
      },
      {
        text: "A quelle formation histologique correspond le plexus de Meissner?",
        choices: [
          { letter: "A", text: "Formation lymphoïde de la sous muqueuse" },
          { letter: "B", text: "Formation nerveuse de la sous muqueuse" },
          { letter: "C", text: "Formation nerveuse de la sous muqueuse" },
          { letter: "D", text: "Formation vasculaire de la sous muqueuse" }
        ]
      },
      {
        text: "Concernant les cellules glandulaires de l'adénohypophyse, elles :",
        choices: [
          { letter: "A", text: "Sont contrôlées par les noyaux parvi-cellulaires" },
          { letter: "B", text: "Se disposent en placards et en amas cellulaires" },
          { letter: "C", text: "Sont révélées uniquement par coloration ordinaire" },
          { letter: "D", text: "Sécrètent parfois un précurseur de plusieurs hormone" }
        ]
      },
      {
        text: "L'ultrastructure du pneumocyte membraneux permet de voir",
        choices: [
          { letter: "A", text: "Des microvillosités au pôle apical" },
          { letter: "B", text: "De nombreux grains de sécrétion" },
          { letter: "C", text: "Un voile cytoplasmique étalé" },
          { letter: "D", text: "Des vésicules de pinocytose" }
        ]
      },
      {
        text: "La toxine diphtérique :",
        choices: [
          { letter: "A", text: "Sa production est contrôlée par la présence de fer" },
          { letter: "B", text: "Sa production est liée à l'état de lysogénie des souches qui hébergent le phage bêta du gène tox" },
          { letter: "C", text: "C'est une endotoxine protéique inhibant sélectivement la synthèse protéique" },
          { letter: "D", text: "C'est une exotoxine glucidique inhibant sélectivement la synthèse protéique" }
        ]
      },
      {
        text: "A propos des marqueurs sérologiques de l'infection par le virus de l'hépatite B (VHB):",
        choices: [
          { letter: "A", text: "La présence de l'Ag HBS signe l'infection aigue" },
          { letter: "B", text: "La présence de l'Ag HBe signe une réplication virale" },
          { letter: "C", text: "La présence de l'ADN viral signe une réplication virale" },
          { letter: "D", text: "La présence des IgG anti HBc signe un contact avec le VHB" }
        ]
      },
      {
        text: "A propos de Mycobacterium tuberculosis :",
        choices: [
          { letter: "A", text: "C'est une bactérie anaérobie stricte à croissance lente" },
          { letter: "B", text: "La coloration de Ziehl-Neelsen est basée sur l'action de la fuchsine phéniquée à chaud" },
          { letter: "C", text: "La résistance aux antibiotiques est en partie due à l'épaisseur de la paroi" },
          { letter: "D", text: "La primo-infection en général très symptomatique oriente le diagnostic" }
        ]
      },
      {
        text: "Concernant les infections urinaires :",
        choices: [
          { letter: "A", text: "Une infection urinaire à Escherichia coli est possible lorsque la bactériurie est égale à 10^3 UFC/ml" },
          { letter: "B", text: "Les infections urinaires sont très fréquentes en milieu communautaire et hospitalier" },
          { letter: "C", text: "Elles sont toujours accompagnées de fièvre" },
          { letter: "D", text: "Le diagnostic est exclusivement clinique" }
        ]
      },
      {
        text: "Les céphèmes :",
        choices: [
          { letter: "A", text: "Constituent le groupe des pénicillines" },
          { letter: "B", text: "Présentent cinq générations à l'heure actuelle" },
          { letter: "C", text: "Leurs intérêts résident surtout dans leurs activités sur les bacilles à Gram positif" },
          { letter: "D", text: "Sont des antibiotiques bactériostatiques à faibles doses" }
        ]
      },
      {
        text: "Concernant Corynebacterium diphteriae :",
        choices: [
          { letter: "A", text: "appartient à la famille des mycobactéries" },
          { letter: "B", text: "C'est un BGN, mobile, capsulé et non sporulé" },
          { letter: "C", text: "C'est un germe exigeant qui donne sur le milieu de Tinsdale des colonies noires avec un halo brun" },
          { letter: "D", text: "Sur gélose au sang, la bactérie donne un aspect de colonies en tâches de bougie" }
        ]
      },
      {
        text: "Les teignes tondantes microsporiques :",
        choices: [
          { letter: "A", text: "Émettent une fluorescence verte en lumière de Wood" },
          { letter: "B", text: "N'émettent pas de fluorescence en lumière de Wood" },
          { letter: "C", text: "Correspondent à de grandes plaques d'alopécie" },
          { letter: "D", text: "Correspondent à de petites plaques d'alopécie" }
        ]
      },
      {
        text: "Concernant le cycle parasitologique de l'Echinococcus granulosus :",
        choices: [
          { letter: "A", text: "L'intestin de l'homme infesté contient des embryons hexacanthes" },
          { letter: "B", text: "L'intestin de l'homme infesté contient la femelle parthénogénétique" },
          { letter: "C", text: "Le chien abrite la forme adulte du parasite" },
          { letter: "D", text: "L'homme s'infeste en ingérant le foie du mouton contenant des kystes hydatiques" }
        ]
      },
      {
        text: "Concernant la toxoplasmose chez la femme enceinte :",
        choices: [
          { letter: "A", text: "La notion d'antécédents de toxoplasmose congénitale dans la fratrie doit être recherchée" },
          { letter: "B", text: "Le risque de transmission materno-fœtale augmente avec l'âge de la grossesse" },
          { letter: "C", text: "Plus la contamination est précoce, moins il y a de risque de malformations graves" },
          { letter: "D", text: "Une séroconversion chez la femme enceinte, peut entraîner un avortement" }
        ]
      },
      {
        text: "Leishmania major :",
        choices: [
          { letter: "A", text: "Est l'agent de la leishmaniose cutanée zoonotique en Algérie" },
          { letter: "B", text: "Est identifiable sur frottis sanguin mince coloré au Ziehl Neelsen" },
          { letter: "C", text: "Peut-être cultivé sur milieu au sang de lapin (NNN)" },
          { letter: "D", text: "Est intracellulaire chez l'hôte mammifère" }
        ]
      },
      {
        text: "Concernant les aspergilloses :",
        choices: [
          { letter: "A", text: "Les Aspergillus sont des moisissures omniprésentes dans notre environnement" },
          { letter: "B", text: "Aspergillus fumigatus est le plus impliqué en pathologie humaine" },
          { letter: "C", text: "La recherche d'antigènes circulants est un excellent test diagnostic de l'aspergillome" },
          { letter: "D", text: "L'aspergillose invasive est favorisée par un déficit de l'immunité humorale" }
        ]
      },
      {
        text: "Comment les Chlamydospores de Candida albicans sont-elles observées au microscope optique ?",
        choices: [
          { letter: "A", text: "Forme des structures filamentaires" },
          { letter: "B", text: "Forme des cellules unicellulaires" },
          { letter: "C", text: "Forme des spores terminales ou latérales, rondes ou ovales" },
          { letter: "D", text: "Forme des formations en forme de pseudomycélium" }
        ]
      },
      {
        text: "Le diagnostic biologique d'une cryptococcose neuro-méningée repose sur :",
        choices: [
          { letter: "A", text: "La recherche dans le LCR de l'antigène polysaccharidique Cryptococcique" },
          { letter: "B", text: "La mise en évidence des levures encapsulées par l'Encre de Chine" },
          { letter: "C", text: "La mise en évidence dans le LCR de la forme filamenteuse du champignon" },
          { letter: "D", text: "La présence de colonies caractéristiques après culture sur milieu de Sabouraud" }
        ]
      },
      {
        text: "Quelle enzyme est responsable de l'hydrolyse des polypeptides en acides aminés au niveau intestinal?",
        choices: [
          { letter: "A", text: "Chymotrypsine" },
          { letter: "B", text: "…………………………." },
          { letter: "C", text: "Carboxypeptidase" },
          { letter: "D", text: "Trypsine" }
        ]
      },
      {
        text: "A quelle famille de réflexes spinaux fait partie le réflexe rotulien ?",
        choices: [
          { letter: "A", text: "Réflexe myotatique" },
          { letter: "B", text: "Réflexe myotatique inversé" },
          { letter: "C", text: "Réflexe d'inhibition des antagonistes" },
          { letter: "D", text: "Réflexe de facilitation des synergiques" }
        ]
      },
      {
        text: "Quelle protéine ne transporte pas les hormones thyroïdiennes ?",
        choices: [
          { letter: "A", text: "Albumine" },
          { letter: "B", text: "Transthyrétine" },
          { letter: "C", text: "Thyroxin binding globuline" },
          { letter: "D", text: "Transcortine" }
        ]
      },
      {
        text: "Parmi les effets de l'hormone de croissance sur le métabolisme phospho-calcique, une réponse est fausse, laquelle?",
        choices: [
          { letter: "A", text: "Augmentation de la réabsorption rénale du phosphore" },
          { letter: "B", text: "Augmentation de la réabsorption rénale du sodium" },
          { letter: "C", text: "Augmentation de l'absorption intestinale du calcium" },
          { letter: "D", text: "Augmentation de la réabsorption rénale du calcium" }
        ]
      },
      {
        text: "Parmi les propositions concernant l'absorption intestinale du calcium, une réponse est fausse, laquelle ?",
        choices: [
          { letter: "A", text: "S'effectue au niveau de l'iléon" },
          { letter: "B", text: "Dépend de la vitamine D" },
          { letter: "C", text: "Nécessite un transport actif" },
          { letter: "D", text: "S'effectue au niveau du duodénum" }
        ]
      },
      {
        text: "L'hyperhydratation est globale dans les situations suivantes, sauf une. Laquelle ?",
        choices: [
          { letter: "A", text: "Insuffisance rénale" },
          { letter: "B", text: "Insuffisance cardiaque" },
          { letter: "C", text: "Insuffisance hépato-cellulaire" },
          { letter: "D", text: "Acidose métabolique" }
        ]
      },
      {
        text: "Les nocicepteurs sont les récepteurs de la douleur qui :",
        choices: [
          { letter: "A", text: "Ne se trouvent pas au niveau de toutes les parties du corps" },
          { letter: "B", text: "Sont en nombre plus important dans les viscères creux que dans les viscères pleins" },
          { letter: "C", text: "Sont encapsulés" },
          { letter: "D", text: "Répondent à des stimulations faibles" }
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