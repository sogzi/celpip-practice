// Built-in Reading & Listening practice sets (one per part).
// Questions are written with the correct answer first; shuffleOptions() mixes them
// deterministically so the answer position varies but stays stable between visits.
import { shuffleOptions, type Question, type Skill, type TestSet } from "./rl";

let n = 0;
/** Multiple-choice question; the first option is the correct one. */
function q(prompt: string, correct: string, distractors: string[], explanation?: string): Question {
  return { id: `b${++n}`, prompt, options: [correct, ...distractors], answer: 0, explanation };
}

const PARAGRAPHS = ["A", "B", "C", "D", "E (Not given)"];
/** Reading Part 3 statement; `para` is A–E. */
function p(prompt: string, para: "A" | "B" | "C" | "D" | "E", explanation?: string): Question {
  return { id: `b${++n}`, prompt, options: PARAGRAPHS, answer: "ABCDE".indexOf(para), explanation };
}

const reading: TestSet[] = [
  {
    id: "builtin-reading-part-1",
    skill: "reading",
    partId: "part-1",
    title: "Moving to Halifax",
    source: "builtin",
    sections: [
      {
        heading: "Message",
        instructions: "Read the following message.",
        text: `Hi Marcus,

I hope you and Elena are enjoying the new house. I've been meaning to write for weeks, but things have been hectic here. Our big news is that Daniel accepted a nursing position at the children's hospital in Halifax, so we're moving east at the end of August.

I have mixed feelings. Daniel has wanted to work in paediatrics since he finished school, and the salary is much better than what he earns now. On the other hand, I've just been promoted at the library, and I'm not sure I'll find something similar right away. My manager has offered to let me work remotely on the digital archive project until December, which takes some of the pressure off.

The hardest part will be finding a place to live. Rents near the hospital are higher than we expected, so we're looking at neighbourhoods across the harbour in Dartmouth. Daniel says the ferry ride would be a nice way to start the day, although I suspect he'll change his mind in February!

Since you lived in Halifax for three years, I was hoping you could give us some advice. Is Dartmouth a good area for a family with a five-year-old? And do you still have that friend who works in real estate?

Let's talk soon. Maybe we can video chat this weekend?

Priya`,
        questions: [
          q("Why is Priya's family moving?", "Daniel accepted a new job.", ["Priya was promoted.", "They want a bigger house.", "Their rent became too expensive."], "“Daniel accepted a nursing position at the children's hospital in Halifax.”"),
          q("How does Priya feel about the move?", "She sees both advantages and disadvantages.", ["She is completely excited.", "She is mainly worried about Daniel.", "She doesn't care either way."], "“I have mixed feelings.” She lists good points (Daniel's dream job) and bad ones (her own job)."),
          q("What has Priya's manager offered her?", "The chance to keep working from home for a few months", ["A promotion at a library in Halifax", "A higher salary", "A job in the hospital archive"], "“Work remotely on the digital archive project until December.”"),
          q("Why are they looking at homes in Dartmouth?", "Housing near the hospital costs more than they expected.", ["It is closer to Priya's library.", "Daniel grew up there.", "Marcus recommended it."], "“Rents near the hospital are higher than we expected, so we're looking at… Dartmouth.”"),
          q("What does Priya suggest about the ferry?", "Daniel may not enjoy it in winter.", ["Daniel is afraid of boats.", "It is too expensive.", "It doesn't run in February."], "“I suspect he'll change his mind in February!”: winter weather."),
          q("What is the main purpose of Priya's message?", "To share news and ask Marcus for advice and a contact", ["To invite Marcus to visit Halifax", "To congratulate Marcus on his new house", "To ask Marcus to help them move"], "She asks about Dartmouth and his real-estate friend."),
        ],
      },
      {
        heading: "Reply",
        instructions: "Here is Marcus's reply. Choose the best option for each blank.",
        text: `Hi Priya,

What wonderful news! Please congratulate Daniel for me. I know how long he's been (7) ______ a job like this.

You're right that Halifax has become expensive. When I lived there, Dartmouth was much more (8) ______, and from what I hear, that's still true. The neighbourhood near Lake Banook is great for kids, with parks, a beach and good schools.

About the ferry: it's lovely in summer, but in winter the wind off the water is (9) ______. Daniel will want a warm coat!

As for my friend, Sandra still works in real estate. I'll (10) ______ her your email address today so she can contact you directly.

And yes, let's video chat on Saturday morning. Elena and I have a (11) ______ afternoon planned, so earlier would be better.

Marcus`,
        questions: [
          q("Blank 7", "hoping for", ["afraid of", "tired of", "looking after"], "Daniel has wanted this kind of job for a long time."),
          q("Blank 8", "affordable", ["crowded", "expensive", "distant"], "Contrasted with “Halifax has become expensive.”"),
          q("Blank 9", "brutal", ["warm", "gentle", "pleasant"], "Contrast with “lovely in summer” and the need for a warm coat."),
          q("Blank 10", "send", ["ask", "receive", "forget"], "He passes on Priya's email address so Sandra can contact her."),
          q("Blank 11", "busy", ["quiet", "free", "empty"], "The afternoon is full, so “earlier would be better.”"),
        ],
      },
    ],
  },
  {
    id: "builtin-reading-part-2",
    skill: "reading",
    partId: "part-2",
    title: "Community centre programs",
    source: "builtin",
    sections: [
      {
        heading: "Diagram and email",
        instructions: "Read the program guide and the email, then answer the questions.",
        table: {
          title: "Riverside Community Centre: Fall Programs (September–December)",
          headers: ["Program", "Day & time", "Ages", "Fee", "Notes"],
          rows: [
            ["Beginner Swimming", "Tue & Thu, 5:00–6:00 pm", "6–12", "$85", "Swimsuit and goggles required"],
            ["Adult Pottery", "Wed, 7:00–9:00 pm", "18+", "$140", "All materials included"],
            ["Family Yoga", "Sat, 10:00–11:00 am", "All ages", "$60 per family", "Bring your own mat"],
            ["Coding Club", "Mon, 4:00–5:30 pm", "10–14", "$95", "Laptops provided"],
            ["English Conversation Café", "Fri, 1:00–2:30 pm", "18+", "Free", "Registration required"],
          ],
          note: "Riverside residents receive 20% off all paid programs. Registration closes August 30.",
        },
        text: `Hi Lucia,

I've been looking at the fall program guide from the community centre, and I think there's something for everyone. Mateo is eight, so he could do (1) ______ after school twice a week. Sofia just turned eleven and loves computers, so the coding club would be perfect, although she'd have to go on (2) ______ afternoons, which is when she has piano lessons. We'll need to move piano to another day.

I'd like to try pottery myself, especially since the fee includes (3) ______. And on weekends, we could all go to (4) ______ together. It's only $60 for the whole family!

Since we live in Riverside, everything will be a bit cheaper. The only problem is time: we have to register before (5) ______, and I haven't even asked Tom yet.

Love,
Ana`,
        questions: [
          q("Blank 1", "Beginner Swimming", ["Coding Club", "Family Yoga", "Adult Pottery"], "Ages 6–12, Tuesdays and Thursdays (twice a week)."),
          q("Blank 2", "Monday", ["Tuesday", "Friday", "Wednesday"], "Coding Club meets Mondays, 4:00–5:30 pm."),
          q("Blank 3", "all materials", ["a free mat", "a laptop", "goggles"], "Adult Pottery note: “All materials included.”"),
          q("Blank 4", "Family Yoga", ["English Conversation Café", "Beginner Swimming", "Coding Club"], "Saturdays, $60 per family."),
          q("Blank 5", "August 30", ["September 1", "the end of December", "Saturday"], "“Registration closes August 30.”"),
          q("How much will Ana pay for Adult Pottery?", "$112", ["$140", "$120", "$28"], "$140 with the 20% Riverside discount = $112."),
          q("What will Ana's family need to change?", "The day of Sofia's piano lessons", ["Mateo's swimming schedule", "Tom's work hours", "Their weekend plans"], "Coding Club is on Monday, when Sofia has piano."),
          q("Which program would Mateo be too young for?", "Coding Club", ["Beginner Swimming", "Family Yoga", "None of them"], "Mateo is eight; Coding Club is for ages 10–14."),
        ],
      },
    ],
  },
  {
    id: "builtin-reading-part-3",
    skill: "reading",
    partId: "part-3",
    title: "Bees in the city",
    source: "builtin",
    sections: [
      {
        heading: "Article",
        instructions: "Decide which paragraph (A–D) contains each piece of information. Choose E if the information is not given.",
        text: `A. Over the past decade, beekeeping has moved from farms into Canadian cities. Toronto, Vancouver and Montreal now have hundreds of registered rooftop and backyard hives. Most urban beekeepers are hobbyists, but a growing number of restaurants and hotels keep hives to produce honey for their own kitchens and to show customers that they care about the environment.

B. Supporters argue that city bees are surprisingly healthy. Urban gardens, parks and balconies offer a wide variety of flowers that bloom from spring to fall, while large farms often grow a single crop that flowers for only a few weeks. Because many cities restrict the use of pesticides on lawns, urban bees may also be exposed to fewer harmful chemicals than bees in the countryside.

C. However, some scientists warn that the trend could have unintended consequences. Honeybees are not native to North America, and they compete with more than 800 species of wild bees for the same flowers. In neighbourhoods with too many hives, researchers have found fewer wild bees, which are often better pollinators of native plants. These experts recommend that cities limit the number of hives per square kilometre.

D. Cities have responded in different ways. Some require beekeepers to register their hives and complete a short training course, while others have no rules at all. Several municipalities now encourage residents to plant native flowers or build "bee hotels" for wild species instead of keeping honeybees. As one city planner put it, "If you want to help bees, start with your garden, not a hive."`,
        questions: [
          p("Some businesses keep bees partly to improve how the public sees them.", "A", "Restaurants and hotels keep hives “to show customers that they care about the environment.”"),
          p("Flowers in cities are available over a longer season than on many farms.", "B", "City flowers bloom “from spring to fall”; farm crops flower “for only a few weeks.”"),
          p("Honeybees originally came from outside North America.", "C", "“Honeybees are not native to North America.”"),
          p("In some places, people must take a course before keeping bees.", "D", "Some cities require beekeepers to “complete a short training course.”"),
          p("Honey produced in cities sells for more than farm honey.", "E", "Prices are never mentioned."),
          p("Too many honeybees in one area may reduce the number of wild bees.", "C", "“In neighbourhoods with too many hives, researchers have found fewer wild bees.”"),
          p("Rules about chemicals may benefit bees that live in cities.", "B", "Pesticide restrictions mean urban bees may be exposed to fewer chemicals."),
          p("Growing native plants is suggested as an alternative to keeping hives.", "D", "Cities encourage residents “to plant native flowers… instead of keeping honeybees.”"),
          p("Most people who keep bees in cities do it for fun.", "A", "“Most urban beekeepers are hobbyists.”"),
        ],
      },
    ],
  },
  {
    id: "builtin-reading-part-4",
    skill: "reading",
    partId: "part-4",
    title: "Car-free downtown",
    source: "builtin",
    sections: [
      {
        heading: "Article",
        instructions: "Read the article and answer the questions.",
        text: `Car-free downtowns: progress or problem?

When the city of Westbrook closed six blocks of its main street to cars last summer, the reaction was immediate. Within weeks, the empty road had filled with café tables, street musicians and families on bicycles. City council now wants to make the change permanent and extend it to the entire downtown core. But not everyone is celebrating.

Supporters say the pilot project proved that people, not cars, bring life to a city centre. According to a survey by the downtown business association, foot traffic increased by 30 percent during the summer, and restaurants with patios reported their best season in a decade. Dr. Amira Haddad, an urban planning professor at Westbrook University, argues that the benefits go beyond the economy. "Air quality improved noticeably, and there were no serious traffic injuries in the area all summer," she says. "Once residents experience car-free streets, they rarely want to go back."

Critics, however, point out that the pilot took place during the warmest months of the year. Hardware store owner Glen Whitaker says his sales fell by almost a fifth because customers could no longer park in front of his shop. "Nobody is going to carry a bag of cement six blocks to a bus stop," he says. Groups representing seniors and people with disabilities have also raised concerns, noting that the nearest parking garage is a long walk for anyone with limited mobility.

City council has proposed a compromise: delivery vehicles would be allowed in the early morning, and a free electric shuttle would connect the downtown core to parking lots on its edges. Accessible parking spaces would be added on side streets. Whitaker remains unconvinced. "A shuttle sounds nice on paper," he says, "but I'll believe it when I see it running in January."

A final vote is expected in the spring.`,
        questions: [
          q("What happened after the street was closed to cars?", "It filled with people and activities.", ["Many businesses moved away.", "Traffic on nearby highways doubled.", "Street musicians were banned."], "“The empty road had filled with café tables, street musicians and families on bicycles.”"),
          q("According to Dr. Haddad, what was one benefit beyond the economy?", "There were no serious traffic injuries in the area.", ["Parking became easier.", "Rents went down.", "More bus routes were added."], "“There were no serious traffic injuries in the area all summer.”"),
          q("Why is Glen Whitaker against the plan?", "His customers can't easily carry heavy items without nearby parking.", ["He dislikes street musicians.", "His rent was increased.", "He thinks the shuttle will cost taxpayers too much."], "“Nobody is going to carry a bag of cement six blocks.”"),
          q("What concern have groups for seniors raised?", "Parking will be too far for people with limited mobility.", ["The shuttle will be too noisy.", "Cafés will block the sidewalks.", "Deliveries will happen too early."], "“The nearest parking garage is a long walk for anyone with limited mobility.”"),
          q("What is Whitaker's attitude toward the proposed shuttle?", "Doubtful", ["Enthusiastic", "Confused", "Indifferent"], "“I'll believe it when I see it running in January.”"),
        ],
      },
      {
        heading: "Reader comment",
        instructions: "A reader posted this comment. Choose the best option for each blank.",
        text: `I own a bakery on Main Street, and I have to disagree with Mr. Whitaker. My sales actually (6) ______ last summer, and many customers told me they enjoyed walking downtown without worrying about traffic. I understand that his situation is different, since few people buy cement on foot. The council's plan to allow (7) ______ early in the morning should help businesses like his.

I am more concerned about winter. The pilot only ran during the (8) ______ months, so we don't really know what will happen in January. That is why I think the shuttle is (9) ______ to the plan's success. If it runs reliably, I will support making the change (10) ______.`,
        questions: [
          q("Blank 6", "increased", ["dropped", "stayed the same", "disappeared"], "She disagrees with Whitaker, whose sales fell."),
          q("Blank 7", "deliveries", ["cars", "bicycles", "buses"], "The compromise allows delivery vehicles in the early morning."),
          q("Blank 8", "summer", ["winter", "spring", "holiday"], "Critics note the pilot ran “during the warmest months.”"),
          q("Blank 9", "essential", ["unrelated", "harmful", "optional"], "Winter success depends on the shuttle."),
          q("Blank 10", "permanent", ["temporary", "illegal", "smaller"], "Council wants to make the change permanent."),
        ],
      },
    ],
  },
];

const listening: TestSet[] = [
  {
    id: "builtin-listening-part-1",
    skill: "listening",
    partId: "part-1",
    title: "Flooded apartment",
    source: "builtin",
    speakers: [
      { name: "Rosa", voice: "female" },
      { name: "Kevin", voice: "male" },
    ],
    sections: [
      {
        heading: "Section 1",
        script: [
          { speaker: "Rosa", text: "Kevin! You look exhausted. Is everything okay?" },
          { speaker: "Kevin", text: "Not really. I woke up at three this morning because water was dripping from my bathroom ceiling. The tenant upstairs left his bathtub running and fell asleep." },
          { speaker: "Rosa", text: "Oh no. How bad is the damage?" },
          { speaker: "Kevin", text: "The bathroom floor is soaked, and part of the hallway carpet is ruined. Luckily, my laptop and most of my books were in the bedroom, so they're fine." },
          { speaker: "Rosa", text: "Did you call your landlord?" },
          { speaker: "Kevin", text: "I left a message at the emergency number, but nobody has called back yet. I have to be at work by nine, so I don't know what to do." },
        ],
        questions: [
          q("Why did Kevin wake up early?", "Water was leaking from the ceiling.", ["His alarm was set wrong.", "His neighbour was playing music.", "He had to catch an early bus."]),
          q("What was damaged?", "The bathroom floor and hallway carpet", ["His laptop and books", "His bedroom furniture", "The kitchen ceiling"]),
          q("What is Kevin's main problem right now?", "He can't reach his landlord before work.", ["He can't find his keys.", "His neighbour refuses to pay.", "He has lost his job."]),
        ],
      },
      {
        heading: "Section 2",
        script: [
          { speaker: "Rosa", text: "Okay, first things first. Take photos of everything before anyone starts cleaning. If you have tenant insurance, they'll want proof." },
          { speaker: "Kevin", text: "I do have insurance, but I've never made a claim. Is it complicated?" },
          { speaker: "Rosa", text: "Not really. When my dishwasher leaked last year, I called the insurance company, sent them the photos, and an adjuster came the next day. The most important thing is to report it within forty-eight hours." },
          { speaker: "Kevin", text: "Forty-eight hours? I had no idea there was a time limit." },
          { speaker: "Rosa", text: "It depends on the policy, so check yours. And keep your receipts if you have to stay somewhere else or replace anything." },
        ],
        questions: [
          q("What does Rosa tell Kevin to do first?", "Take pictures of the damage", ["Clean the floor", "Move out immediately", "Call the police"]),
          q("What happened when Rosa made an insurance claim?", "An adjuster visited the next day.", ["She waited a month for an answer.", "Her claim was rejected.", "She had to hire a lawyer."]),
          q("What surprised Kevin?", "There may be a deadline for reporting the damage.", ["He has insurance.", "Rosa's dishwasher leaked.", "Receipts are not needed."]),
        ],
      },
      {
        heading: "Section 3",
        script: [
          { speaker: "Kevin", text: "This is really helpful. But what about work? My manager is strict about lateness." },
          { speaker: "Rosa", text: "Why don't you call her now and explain? Most managers understand emergencies. You could offer to work from home this afternoon while you wait for the landlord." },
          { speaker: "Kevin", text: "That's a good idea. Actually, I could also ask my brother to come over. He lives ten minutes away and works night shifts, so he's usually free in the morning." },
          { speaker: "Rosa", text: "Perfect. Then he can let the landlord in, and you can go to work." },
          { speaker: "Kevin", text: "Thanks, Rosa. I'll call my brother first, and then my manager." },
        ],
        questions: [
          q("Why could Kevin's brother help?", "He lives nearby and is usually free in the morning.", ["He is a plumber.", "He works for the landlord.", "He has a spare apartment."]),
          q("What will Kevin do first?", "Call his brother", ["Call his manager", "Go to work", "Call the insurance company"]),
        ],
      },
    ],
  },
  {
    id: "builtin-listening-part-2",
    skill: "listening",
    partId: "part-2",
    title: "Returning a jacket",
    source: "builtin",
    speakers: [
      { name: "Clerk", voice: "male" },
      { name: "Customer", voice: "female" },
    ],
    sections: [
      {
        script: [
          { speaker: "Clerk", text: "Hi there, how can I help you today?" },
          { speaker: "Customer", text: "Hi. I bought this winter jacket here two weeks ago, and I'd like to return it. The zipper broke the second time I wore it." },
          { speaker: "Clerk", text: "I'm sorry to hear that. Do you have your receipt?" },
          { speaker: "Customer", text: "I have it on my phone. The store emailed it to me." },
          { speaker: "Clerk", text: "That works. Let me see. Yes, this was on sale, so normally we'd only offer store credit. But since the item is defective, I can give you a full refund to your credit card." },
          { speaker: "Customer", text: "Actually, I'd prefer to exchange it, if you have the same jacket in a different colour. I really like the style." },
          { speaker: "Clerk", text: "Let me check. We have it in navy and grey, but only in a medium. You bought a small." },
          { speaker: "Customer", text: "Hmm. The small was a bit tight in the shoulders anyway. Can I try the medium in grey?" },
          { speaker: "Clerk", text: "Of course. The fitting rooms are just behind you. And if the zipper gives you any trouble again, the manufacturer offers a one-year warranty, so keep that receipt." },
        ],
        questions: [
          q("Why does the woman want to return the jacket?", "The zipper broke.", ["It is the wrong size.", "She found it cheaper elsewhere.", "She doesn't like the colour."]),
          q("How does she show proof of purchase?", "With a receipt that was emailed to her", ["With a paper receipt", "With her credit card statement", "With the price tag"]),
          q("Why can she get a full refund even though the jacket was on sale?", "Because the jacket is defective", ["Because she is a regular customer", "Because she paid cash", "Because she returned it within a week"]),
          q("What does the woman decide to do?", "Try a different size and colour", ["Take store credit", "Get a full refund", "Buy a second jacket"]),
          q("What does the clerk say about the warranty?", "It lasts one year.", ["It does not cover zippers.", "It must be registered online.", "It only applies to full-price items."]),
        ],
      },
    ],
  },
  {
    id: "builtin-listening-part-3",
    skill: "listening",
    partId: "part-3",
    title: "Food bank interview",
    source: "builtin",
    speakers: [
      { name: "Host", voice: "female" },
      { name: "Raj", voice: "male" },
    ],
    sections: [
      {
        script: [
          { speaker: "Host", text: "Welcome back to Community Matters. My guest today is Raj Mehta, volunteer coordinator at the Eastside Food Bank. Raj, thanks for joining us." },
          { speaker: "Raj", text: "Thanks for having me." },
          { speaker: "Host", text: "Demand at food banks has grown a lot recently. What are you seeing at Eastside?" },
          { speaker: "Raj", text: "We're serving about forty percent more households than we did two years ago. What's changed most is who's coming in. We see many more working families now, people with full-time jobs who simply can't keep up with rent and grocery prices." },
          { speaker: "Host", text: "That must put a lot of pressure on your volunteers." },
          { speaker: "Raj", text: "It does. We have around two hundred regular volunteers, but we especially need people on weekday mornings, when most of our deliveries arrive. Weekends are actually easy to fill, because students and office workers are available then." },
          { speaker: "Host", text: "What kind of commitment do you ask for?" },
          { speaker: "Raj", text: "Just one three-hour shift a month to start. Everyone gets a short orientation, and if you want to drive our delivery van, you'll need a clean driving record and an extra training session." },
          { speaker: "Host", text: "And for listeners who can't volunteer?" },
          { speaker: "Raj", text: "Honestly, money goes further than food donations. Because we buy in bulk from wholesalers, every dollar lets us provide about three dollars' worth of groceries." },
        ],
        questions: [
          q("What has changed most about the people using the food bank?", "More working families are coming.", ["More seniors are coming.", "Fewer students are coming.", "More people are coming from other cities."]),
          q("By how much has demand grown in two years?", "About 40 percent", ["About 20 percent", "About 200 percent", "It has tripled."]),
          q("When does the food bank most need volunteers?", "Weekday mornings", ["Weekend afternoons", "Weekday evenings", "Holidays"]),
          q("Why are weekend shifts easy to fill?", "Students and office workers are free then.", ["Most deliveries arrive on weekends.", "The food bank closes early.", "Drivers prefer weekends."]),
          q("What do volunteers need to drive the delivery van?", "A clean driving record and extra training", ["A commercial licence", "Three shifts a month", "A year of experience"]),
          q("Why does Raj prefer donations of money?", "The food bank can buy more food per dollar.", ["Donated food is often expired.", "Money is easier to store.", "Food donations are taxed."]),
        ],
      },
    ],
  },
  {
    id: "builtin-listening-part-4",
    skill: "listening",
    partId: "part-4",
    title: "Tap-to-pay transit",
    source: "builtin",
    speakers: [{ name: "Newscaster", voice: "female" }],
    sections: [
      {
        script: [
          { speaker: "Newscaster", text: "Good evening. Starting next Monday, riders on Lakeview Transit will no longer need to buy paper tickets. The city is introducing a tap-to-pay system that accepts credit cards, debit cards and mobile phones on all buses and trains." },
          { speaker: "Newscaster", text: "Transit officials say the change will speed up boarding, especially during rush hour, when drivers currently spend several minutes checking tickets at busy stops. The system will also automatically cap daily fares at eight dollars, so riders who take several trips in one day will never pay more than the price of a day pass." },
          { speaker: "Newscaster", text: "Not everyone is pleased. Advocates for low-income residents worry that people without bank cards or smartphones will be left behind. In response, the city says reloadable transit cards will remain available at libraries and community centres, and paper tickets will continue to be sold at major stations until the end of the year." },
          { speaker: "Newscaster", text: "The project cost twelve million dollars, most of it paid for by a provincial infrastructure grant. Officials expect it to save the city about one and a half million dollars a year in printing and cash-handling costs." },
        ],
        questions: [
          q("What is changing on Lakeview Transit?", "Riders can pay by tapping a card or phone.", ["Fares are going up.", "Trains are being replaced by buses.", "Paper tickets will cost more."]),
          q("What benefit do officials mention?", "Faster boarding", ["Free rides at rush hour", "More drivers", "Longer routes"]),
          q("What is the most a rider will pay in one day?", "$8", ["$1.50", "$12", "The price of two trips"]),
          q("What concern do advocates raise?", "People without bank cards or smartphones may have trouble paying.", ["The system cost too much to build.", "Drivers will lose their jobs.", "Libraries will stop selling tickets."]),
          q("How was most of the project paid for?", "By a provincial grant", ["By raising fares", "By private companies", "By selling advertising"]),
        ],
      },
    ],
  },
  {
    id: "builtin-listening-part-5",
    skill: "listening",
    partId: "part-5",
    title: "Planning a team event",
    source: "builtin",
    speakers: [
      { name: "Nadia", voice: "female" },
      { name: "Tom", voice: "male" },
      { name: "Grace", voice: "female" },
    ],
    sections: [
      {
        script: [
          { speaker: "Nadia", text: "Thanks for staying a few minutes. As you know, we have a budget of fifteen hundred dollars for a team event before the holidays, and I'd like to decide today." },
          { speaker: "Tom", text: "I still think a dinner is the best option. Everyone can relax, and nobody has to do anything they're uncomfortable with." },
          { speaker: "Grace", text: "A dinner is nice, but we did that last year, and honestly, people just talked to the same three colleagues they always talk to. I'd like something where people mix more. What about an escape room?" },
          { speaker: "Tom", text: "Escape rooms can be stressful. And most rooms only fit eight people. We have twenty-two." },
          { speaker: "Grace", text: "The place downtown has four rooms side by side, so we could split into teams and compare times afterwards. It's about forty dollars a person." },
          { speaker: "Nadia", text: "That's around nine hundred dollars, which would leave enough for food afterwards. Tom, would that address your concern?" },
          { speaker: "Tom", text: "Partly. My bigger worry is Martin and Priya. Martin uses a wheelchair, and Priya told me she gets anxious in small spaces." },
          { speaker: "Grace", text: "That's a fair point. I didn't think about accessibility." },
          { speaker: "Nadia", text: "Let's not assume, though. I'll check with the venue about wheelchair access, and I'll ask everyone privately whether they're comfortable. If anyone isn't, we'll go with Tom's dinner idea." },
          { speaker: "Tom", text: "That sounds fair. And for the dinner, we could do assigned seating so people mix, like Grace wanted." },
          { speaker: "Grace", text: "I love that. Okay, I'm happy either way." },
          { speaker: "Nadia", text: "Great. I'll send a short survey by Friday, and we'll book by the end of next week." },
        ],
        questions: [
          q("What is the purpose of the meeting?", "To choose a holiday team event", ["To set the annual budget", "To plan a client dinner", "To hire new staff"]),
          q("Why doesn't Grace want another dinner?", "People didn't mix much last year.", ["It costs too much.", "The restaurant was closed.", "Tom organized it badly."]),
          q("What is Tom's first objection to the escape room?", "It can be stressful and the rooms are small.", ["It is too far away.", "It is too expensive.", "It is only open on weekends."]),
          q("How does Grace answer the problem of group size?", "The venue has several rooms side by side.", ["They could go on two different days.", "Only volunteers would go.", "They could rent a bigger room."]),
          q("About how much would the escape room cost in total?", "$900", ["$400", "$1,500", "$40"]),
          q("What is Tom's bigger concern?", "Two colleagues might not be able or comfortable to take part.", ["The cost of food afterwards", "The date of the event", "Grace's planning skills"]),
          q("What will Nadia do?", "Check accessibility and ask everyone privately", ["Book the escape room right away", "Cancel the event", "Ask Martin and Priya to stay home"]),
          q("What does Tom suggest to make the dinner better?", "Assigned seating so people mix", ["A cheaper restaurant", "Inviting families", "Holding it at the office"]),
        ],
      },
    ],
  },
  {
    id: "builtin-listening-part-6",
    skill: "listening",
    partId: "part-6",
    title: "Homework debate",
    source: "builtin",
    speakers: [{ name: "Presenter", voice: "male" }],
    sections: [
      {
        script: [
          { speaker: "Presenter", text: "Few topics divide parents as much as homework. This year, two elementary schools in our district stopped assigning it entirely, and the results have sparked a lively debate." },
          { speaker: "Presenter", text: "Supporters of the change point to research suggesting that homework has little academic benefit for children under twelve. Principal Lena Ortiz says that since her school dropped homework, teachers have noticed students arriving more rested and more eager to learn. Families also report fewer evening arguments and more time for sports, music and simply playing outside, which child psychologists say is essential for healthy development." },
          { speaker: "Presenter", text: "Others are less convinced. Some parents say homework was the only way they could see what their children were learning and where they were struggling. Teacher Mark Chen, who works at a school that still assigns homework, argues that short, regular practice builds habits like time management that students will need in high school. He also worries that the policy could widen gaps between students, because children whose parents can afford tutors will keep practising at home while others fall behind." },
          { speaker: "Presenter", text: "For now, the district has chosen a middle path. Instead of banning homework, it will ask teachers to limit assignments to about ten minutes per grade level each night, so a grade-three student would have no more than thirty minutes. Reading for pleasure will count toward that time. The district plans to survey families again next June before making any further changes." },
        ],
        questions: [
          q("What is the talk mainly about?", "A debate over homework in elementary schools", ["A new high school program", "The cost of tutoring", "A shortage of teachers"]),
          q("According to Principal Ortiz, what has changed since homework was dropped?", "Students seem more rested and eager to learn.", ["Test scores fell.", "Parents complain more.", "Teachers work longer hours."]),
          q("Why do some parents want homework?", "It shows them what their children are learning and struggling with.", ["It keeps children busy.", "It replaces tutoring.", "Teachers need it for report cards."]),
          q("What is Mark Chen's concern about fairness?", "Children with tutors may get further ahead.", ["Only wealthy schools will drop homework.", "Teachers will be paid less.", "Students will switch schools."]),
          q("Under the new guideline, how much homework could a grade-three student get?", "Up to 30 minutes", ["Up to 10 minutes", "Up to 20 minutes", "Up to an hour"]),
          q("What will the district do next June?", "Survey families again", ["Ban homework completely", "Hire more tutors", "Extend the school day"]),
        ],
      },
    ],
  },
];

const BANK: Record<Skill, TestSet[]> = {
  reading: reading.map((s) => shuffleOptions(s)),
  listening: listening.map((s) => shuffleOptions(s)),
};

export function getBuiltinSet(skill: Skill, partId: string) {
  return BANK[skill].find((s) => s.partId === partId);
}
