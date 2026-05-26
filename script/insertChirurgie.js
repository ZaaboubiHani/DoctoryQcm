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
      name: "Chirurgie",
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
        text: "Une hernie de la paroi abdominale:",
        choices: [
          { letter: "A", text: "Est une protrusion" },
          { letter: "B", text: "Est un passage d'un organe de la cavité abdominale à travers un orifice" },
          { letter: "C", text: "L'orifice provient de la désunion d'une plaie opératoire" },
          { letter: "D", text: "Se fait à travers des zones de faiblesse" }
        ]
      },
      {
        text: "Toutes ces complications peuvent se voir en cas d'appendicite aigue négligée sauf une, laquelle ?",
        choices: [
          { letter: "A", text: "Péritonite aigue" },
          { letter: "B", text: "Abcès intra abdominal" },
          { letter: "C", text: "Choc septique" },
          { letter: "D", text: "Occlusion sur bride" }
        ]
      },
      {
        text: "Pour évaluer la gravité d'une pancréatite aiguë:",
        choices: [
          { letter: "A", text: "La recherche d'un SIRS est simple et fiable" },
          { letter: "B", text: "La lipasémie est corrélée à la gravité de la pancréatite" },
          { letter: "C", text: "Le scanner initial doit être réalisé dès l'admission du patient, à la recherche de complications" },
          { letter: "D", text: "Le score CTSI (CT Severity Index) doit remplacer le score de BALTHAZAR" }
        ]
      },
      {
        text: "Parmi les propositions suivantes, citez celle qui évoque l'origine pancréatique d'une douleur:",
        choices: [
          { letter: "A", text: "Péri-ombilicale calmée par les repas" },
          { letter: "B", text: "Intermittente et capricieuse" },
          { letter: "C", text: "Calmée par l'anté-flexion" },
          { letter: "D", text: "Epigastrique à irradiation rétro-sternale" }
        ]
      },
      {
        text: "Parmi les affirmations suivantes sur les péritonites aigues, citez celles qui sont exactes:",
        choices: [
          { letter: "A", text: "Leur diagnostic est en général fondé sur l'examen clinique" },
          { letter: "B", text: "La contracture abdominale est habituellement présente" },
          { letter: "C", text: "Les examens biologiques ont une valeur diagnostique certaine" },
          { letter: "D", text: "Leur traitement est exclusivement chirurgical" }
        ]
      },
      {
        text: "Quel est le signe radiologique qui traduit un iléus biliaire ?",
        choices: [
          { letter: "A", text: "Croissant clair gazeux sous-diaphragmatique" },
          { letter: "B", text: "Présence de l'air dans les voies biliaires" },
          { letter: "C", text: "Images hydro-aériques mixtes" },
          { letter: "D", text: "Élargissement des gouttières pariéto-coliques" }
        ]
      },
      {
        text: "Le diagnostic de gravité dans les pancréatites aiguës est apprécié par :",
        choices: [
          { letter: "A", text: "L'intensité de la douleur" },
          { letter: "B", text: "La fièvre" },
          { letter: "C", text: "La tachycardie" },
          { letter: "D", text: "La polypnée" }
        ]
      },
      {
        text: "Une occlusion intestinale aiguë fonctionnelle peut être secondaire à (cochez les réponses fausses) :",
        choices: [
          { letter: "A", text: "Une hypokaliémie" },
          { letter: "B", text: "Une hyponatrémie" },
          { letter: "C", text: "Une tumeur du grêle" },
          { letter: "D", text: "Un iléus biliaire" }
        ]
      },
      {
        text: "Le diagnostic de cholécystite aiguë lithiasique est retenu devant :",
        choices: [
          { letter: "A", text: "Une fièvre à 38,5 °C" },
          { letter: "B", text: "Un signe de Murphy positif" },
          { letter: "C", text: "Des transaminases et des PAL élevées" },
          { letter: "D", text: "Un aspect de vésicule porcelaine à l'échographie" }
        ]
      },
      {
        text: "Le symptôme clinique le plus constant dans la cataracte sénile est :",
        choices: [
          { letter: "A", text: "La diplopie" },
          { letter: "B", text: "L'amaurose" },
          { letter: "C", text: "La photopsie" },
          { letter: "D", text: "La baisse progressive de la vision" }
        ]
      },
      {
        text: "Parmi ces affections oculaires responsables de baisse d'acuité visuelle brutale avec œil blanc indolore, laquelle donne un fond d'œil normal?",
        choices: [
          { letter: "A", text: "Neuropathie optique ischémique antérieure aigue" },
          { letter: "B", text: "Occlusion de la veine centrale de la rétine," },
          { letter: "C", text: "Neuropathie optique rétrobulbaire" },
          { letter: "D", text: "Occlusion de l'artère centrale de la rétine" }
        ]
      },
      {
        text: "Parmi les affections suivantes, quelle est celle qui n'entraîne pas de cataracte ?",
        choices: [
          { letter: "A", text: "Le diabète" },
          { letter: "B", text: "La maladie de Horton" },
          { letter: "C", text: "La rubéole congénitale" },
          { letter: "D", text: "L'uvéite antérieure à répétition" }
        ]
      },
      {
        text: "Quels sont les signes fonctionnels qui peuvent faire évoquer le diagnostic de cataracte ?",
        choices: [
          { letter: "A", text: "Baisse d'acuité visuelle" },
          { letter: "B", text: "Métamorphopsies" },
          { letter: "C", text: "Halos colorés" },
          { letter: "D", text: "Éblouissement" }
        ]
      },
      {
        text: "Devant un œil rouge et douloureux avec baisse de l'acuité visuelle, quels diagnostics évoquez-vous ?",
        choices: [
          { letter: "A", text: "Sclérite" },
          { letter: "B", text: "Endophtalmie" },
          { letter: "C", text: "Kératite" },
          { letter: "D", text: "Uvéite antérieure aiguë" }
        ]
      },
      {
        text: "Le mécanisme indirect qui est à l'origine de la luxation antéro-interne de l'épaule survient sur un membre supérieur en :",
        choices: [
          { letter: "A", text: "Abduction et rotation externe" },
          { letter: "B", text: "Abduction et rotation externe" },
          { letter: "C", text: "Abduction et rotation interne" },
          { letter: "D", text: "Rétropulsion et rotation interne" }
        ]
      },
      {
        text: "La luxation postérieure de la hanche avec fracture du cotyle peut être responsable :",
        choices: [
          { letter: "A", text: "D'une rupture de vessie" },
          { letter: "B", text: "D'une lésion de l'artère fémorale" },
          { letter: "C", text: "D'une nécrose de la tête fémorale" },
          { letter: "D", text: "D'une coxarthrose" }
        ]
      },
      {
        text: "Quel examen d'imagerie est indispensable au diagnostic d'une fracture de la palette humérale ?",
        choices: [
          { letter: "A", text: "Échographie" },
          { letter: "B", text: "IRM" },
          { letter: "C", text: "Radiographie standard de face et de profil du coude" },
          { letter: "D", text: "Scanner" }
        ]
      },
      {
        text: "Les mécanismes fréquents du traumatisme du rachis dorsolombaire sont :",
        choices: [
          { letter: "A", text: "Chute sur les pieds (choc axial)" },
          { letter: "B", text: "Traumatisme en hyperflexion du tronc" },
          { letter: "C", text: "Accident de la voie publique avec décélération brutale" },
          { letter: "D", text: "Torsion légère du rachis" }
        ]
      },
      {
        text: "Concernant la définition d'une fracture ouverte de jambe:",
        choices: [
          { letter: "A", text: "Communication du foyer fracturaire avec l'extérieur" },
          { letter: "B", text: "Rupture cutanée …………………….." },
          { letter: "C", text: "Absence d'une communication entre la fracture et l'extérieur" },
          { letter: "D", text: "Urgence médico-chirurgicale" }
        ]
      },
      {
        text: "La luxation de l'épaule est le plus souvent :",
        choices: [
          { letter: "A", text: "Antéro-interne sous-claviculaire" },
          { letter: "B", text: "Inférieure sous glénoïdienne" },
          { letter: "C", text: "Antéro-interne sous-coracoïdienne" },
          { letter: "D", text: "Postérieure" }
        ]
      },
      {
        text: "Lors des luxations antéro-internes de l'épaule, le sillon delto-pectoral est comblé par :",
        choices: [
          { letter: "A", text: "L'hématome" },
          { letter: "B", text: "La tête humérale" },
          { letter: "C", text: "Les tendons de la coiffe des rotateurs" },
          { letter: "D", text: "Le petit pectoral" }
        ]
      },
      {
        text: "Les complications précoces d'une fracture de la diaphyse fémorale sont :",
        choices: [
          { letter: "A", text: "Syndrome des loges de la cuisse" },
          { letter: "B", text: "Lésion de l'artère fémorale" },
          { letter: "C", text: "Embolie graisseuse" },
          { letter: "D", text: "Infection nosocomiale immédiate" }
        ]
      },
      {
        text: "Lors de la surveillance post-opératoire, l'apparition de douleurs croissantes, raideur des doigts et pâleur évoque :",
        choices: [
          { letter: "A", text: "Une complication infectieuse" },
          { letter: "B", text: "Une paralysie radiale" },
          { letter: "C", text: "Un syndrome des loges débutant" },
          { letter: "D", text: "Une douleur post-opératoire banale" }
        ]
      },
      {
        text: "Quelle est la cause la plus fréquente de la fracture de la palette humérale chez l'enfant ?",
        choices: [
          { letter: "A", text: "Traumatisme en hyperflexion du coude" },
          { letter: "B", text: "Traumatisme en hyperextension du coude" },
          { letter: "C", text: "Chute sur le poignet en extension" },
          { letter: "D", text: "Entorse du coude" }
        ]
      },
      {
        text: "Le cancer du cavum est suspecté devant :",
        choices: [
          { letter: "A", text: "Une sensation de plénitude auriculaire unilatérale" },
          { letter: "B", text: "Une diplopie" },
          { letter: "C", text: "Une épistaxis" },
          { letter: "D", text: "Une paralysie faciale" }
        ]
      },
      {
        text: "Concernant une obstruction nasale chronique bilatérale, lesquelles de ces propositions sont exactes ?",
        choices: [
          { letter: "A", text: "Peut s'associer à des troubles de l'odorat" },
          { letter: "B", text: "Peut être due à une polypose naso-sinusienne" },
          { letter: "C", text: "Peut-être en rapport avec une prise médicamenteuse prolongée" },
          { letter: "D", text: "Est due le plus souvent à des causes tumorales" }
        ]
      },
      {
        text: "Monsieur M 48 ans vient vous voir car , depuis 4 mois , ……………………………….. 1 paquet de cigarette par jour depuis l'âge de 18 ans",
        choices: [
          { letter: "A", text: "On peut parler d'une dysphonie chronique" },
          { letter: "B", text: "les nerfs responsables de la mobilité des cordes vocales sont les nerfs laryngés inférieurs" },
          { letter: "C", text: "On peut parler de trouble de la prononciation" },
          { letter: "D", text: "On ne pourra parler de dysphonie qu apres un ………………… de la voix" }
        ]
      },
      {
        text: "Parmi les propositions suivantes concernant le diagnostic d'une sinusite maxillaire aiguë, quelles sont les réponses inexactes?",
        choices: [
          { letter: "A", text: "Le diagnostic est clinique" },
          { letter: "B", text: "Un scanner injecté des sinus est indispensable pour poser le diagnostic" },
          { letter: "C", text: "Un bilan biologique est nécessaire pour poser le diagnostic" },
          { letter: "D", text: "Une naso-fibroscopie est utile pour le diagnostic" }
        ]
      },
      {
        text: "Parmi les propositions suivantes, quelles sont les affirmations exactes?",
        choices: [
          { letter: "A", text: "La vascularisation artérielle des fosses nasales se fait uniquement par des branches de la carotide externe" },
          { letter: "B", text: "L'artère ethmoïdale antérieure est une branche de l'artère ophtalmique" },
          { letter: "C", text: "La tache vasculaire peut être caractérisée en cas d'épistaxis secondaire à une fragilité capillaire" },
          { letter: "D", text: "Les méats moyens sont le site de drainage des sinus maxillaires, frontaux et sphénoïdaux" }
        ]
      },
      {
        text: "L'hémorragie méningée survient préférentiellement :",
        choices: [
          { letter: "A", text: "A l'occasion d'un effort" },
          { letter: "B", text: "Lors d'un changement de pression atmosphérique" },
          { letter: "C", text: "Pendant le sommeil" },
          { letter: "D", text: "Le matin au réveil" }
        ]
      },
      {
        text: "Quels sont les trois signes d'une lésion centromédullaire d'un syndrome syringomyélique ?",
        choices: [
          { letter: "A", text: "Des troubles de la sensibilité profonde" },
          { letter: "B", text: "Un trouble dissocié de la sensibilité thermique" },
          { letter: "C", text: "Un trouble suspendu de la sensibilité algique" },
          { letter: "D", text: "Un trouble suspendu de la sensibilité tactile" }
        ]
      },
      {
        text: "Concernant l'hématome sous-dural chronique :",
        choices: [
          { letter: "A", text: "Il survient souvent chez le vieux" },
          { letter: "B", text: "Il se résorbe spontanément" },
          { letter: "C", text: "Il peut récidiver après évacuation chirurgicale" },
          { letter: "D", text: "Il peut être bilatéral" }
        ]
      },
      {
        text: "L'aménorrhée primaire peut être due à :",
        choices: [
          { letter: "A", text: "Une tuberculose génitale pré-pubertaire" },
          { letter: "B", text: "Un syndrome de Morris" },
          { letter: "C", text: "Un syndrome de Sheehan" },
          { letter: "D", text: "Un diaphragme vaginal complet" }
        ]
      },
      {
        text: "Une aménorrhée secondaire peut être liée à :",
        choices: [
          { letter: "A", text: "Une anorexie mentale" },
          { letter: "B", text: "Une aplasie utérine" },
          { letter: "C", text: "Un adénome à prolactine" },
          { letter: "D", text: "Une synéchie tuberculeuse" }
        ]
      },
      {
        text: "Quelles sont les complications du kyste de l'ovaire ?",
        choices: [
          { letter: "A", text: "Une torsion" },
          { letter: "B", text: "Une rupture" },
          { letter: "C", text: "Une dégénérescence" },
          { letter: "D", text: "Une hémorragie" }
        ]
      },
      {
        text: "Quel est le type anatomopathologique le plus fréquent des tumeurs de vessie ?",
        choices: [
          { letter: "A", text: "Carcinome épidermoïde" },
          { letter: "B", text: "Adénocarcinome" },
          { letter: "C", text: "Carcinome urothélial" },
          { letter: "D", text: "Carcinome à cellules claires" }
        ]
      },
      {
        text: "A propos de la colique néphrétique :",
        choices: [
          { letter: "A", text: "L'étiologie de la colique néphrétique est dominée par la pathologie lithiasique" },
          { letter: "B", text: "La colique néphrétique fébrile est une forme compliquée traitée en ambulatoire" },
          { letter: "C", text: "On peut donner le traitement expulsif en cas d'une colique néphrétique sur lithiase de 10 mm de l'uretère" },
          { letter: "D", text: "La colique néphrétique hyperalgique chez la femme enceinte, exige un drainage par une sonde JJ" }
        ]
      },
      {
        text: "Concernant les tumeurs de la vessie non infiltrant le muscle :",
        choices: [
          { letter: "A", text: "La surveillance se fait par cystoscopie régulière" },
          { letter: "B", text: "Le BCG intravésical est indiqué dans les formes à haut risque" },
          { letter: "C", text: "Le scanner est suffisant pour le suivi" },
          { letter: "D", text: "Elle représente plus de 75% des tumeurs vésicales" }
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