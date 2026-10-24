// Additional built-in Listening tests (Tests 2 and 3 for each part).
import type { TestSet } from "./rl";
import { q } from "./rl-q";

export const moreListening: TestSet[] = [
  // ---------------------------------------------------------------- Part 1
  {
    id: "builtin-listening-part-1-passport",
    skill: "listening",
    partId: "part-1",
    title: "Expired passport",
    source: "builtin",
    speakers: [
      { name: "Aisha", voice: "female" },
      { name: "Ben", voice: "male" },
    ],
    sections: [
      {
        heading: "Section 1",
        script: [
          { speaker: "Ben", text: "Aisha, you look worried. What's going on?" },
          { speaker: "Aisha", text: "I just realized my passport expired last month. We fly to Mexico for my cousin's wedding in twelve days, and I completely forgot to check." },
          { speaker: "Ben", text: "Oh no. Is it just yours, or your husband's too?" },
          { speaker: "Aisha", text: "Just mine. Omar renewed his last year. The flights and the hotel are already paid for, and I'm one of the bridesmaids, so I really can't miss it." },
          { speaker: "Ben", text: "Okay. Twelve days isn't a lot of time, but it might be possible." },
          { speaker: "Aisha", text: "I hope so. The government website says regular processing takes ten business days, but that's if you mail the application. I don't trust the mail with something this important." },
        ],
        questions: [
          q("What is Aisha's problem?", "Her passport has expired before an important trip.", ["She lost her passport at the airport.", "Her flight was cancelled.", "Her husband forgot to renew his passport."]),
          q("Why can't Aisha miss the trip?", "She is in her cousin's wedding.", ["She is starting a new job in Mexico.", "Her husband is going without her.", "She has a business meeting there."]),
          q("Why doesn't Aisha want to apply by mail?", "She doesn't trust the mail with something so important.", ["The post office is closed.", "It costs too much.", "She doesn't have a stamp."]),
        ],
      },
      {
        heading: "Section 2",
        script: [
          { speaker: "Ben", text: "You don't have to mail it. When my daughter's passport got damaged, we went to a passport office in person. If you have proof of travel, you can ask for faster service." },
          { speaker: "Aisha", text: "Really? How fast?" },
          { speaker: "Ben", text: "There's an express option that takes two to nine business days, and an urgent option where you get it the next business day. The urgent one costs a lot more, though, maybe double." },
          { speaker: "Aisha", text: "Honestly, I'd pay almost anything at this point. What do I need to bring?" },
          { speaker: "Ben", text: "Your old passport, the completed form, two new photos, and your flight itinerary. Oh, and you need a guarantor or references, depending on the form. Check that carefully, because that's where we made a mistake the first time." },
        ],
        questions: [
          q("What does Ben suggest?", "Applying in person at a passport office", ["Postponing the trip", "Asking the airline for help", "Calling the Mexican embassy"]),
          q("What is true about the urgent service?", "It is faster but much more expensive.", ["It takes nine business days.", "It is free with proof of travel.", "It is only for children."]),
          q("What mistake did Ben make before?", "He had a problem with the guarantor or references.", ["He forgot the photos.", "He went to the wrong office.", "He brought an expired itinerary."]),
        ],
      },
      {
        heading: "Section 3",
        script: [
          { speaker: "Aisha", text: "Do I need an appointment, or can I just show up?" },
          { speaker: "Ben", text: "You can walk in, but the lines are long, especially in the morning. Some offices let you book online now, and that saved us hours." },
          { speaker: "Aisha", text: "Okay. I'll get my photos taken at the pharmacy at lunch, and tonight I'll fill out the form and try to book an appointment for tomorrow." },
          { speaker: "Ben", text: "Good plan. And make sure the photos follow the size rules. The pharmacy usually knows, but double-check." },
          { speaker: "Aisha", text: "Thanks, Ben. You've saved me a lot of stress." },
        ],
        questions: [
          q("What helped Ben avoid waiting in line?", "Booking an appointment online", ["Arriving early in the morning", "Going on a weekend", "Using a travel agent"]),
          q("What will Aisha do at lunch?", "Get her passport photos taken", ["Book her appointment", "Fill out the form", "Go to the passport office"]),
        ],
      },
    ],
  },
  {
    id: "builtin-listening-part-1-daycare",
    skill: "listening",
    partId: "part-1",
    title: "Daycare problem",
    source: "builtin",
    speakers: [
      { name: "Lauren", voice: "female" },
      { name: "Diego", voice: "male" },
    ],
    sections: [
      {
        heading: "Section 1",
        script: [
          { speaker: "Diego", text: "Hey Lauren, you were quiet in the meeting. Everything all right?" },
          { speaker: "Lauren", text: "Not really. I got a call from my son's daycare this morning. They're closing at the end of the month because the owner is retiring." },
          { speaker: "Diego", text: "At the end of this month? That's only three weeks away!" },
          { speaker: "Lauren", text: "Exactly. And every daycare near our place has a waiting list of at least a year. I called five of them during my break." },
          { speaker: "Diego", text: "What about your partner? Can he work from home for a while?" },
          { speaker: "Lauren", text: "Not really. Josh is a nurse, so he works twelve-hour shifts at the hospital. And my parents live in Winnipeg, so they can't help either." },
        ],
        questions: [
          q("Why is the daycare closing?", "The owner is retiring.", ["It failed a safety inspection.", "The building was sold.", "It doesn't have enough children."]),
          q("What did Lauren find out when she called other daycares?", "They all have long waiting lists.", ["They are too expensive.", "They don't take children her son's age.", "They are closed during the summer."]),
          q("Why can't Lauren's family help?", "Her partner works long shifts and her parents live far away.", ["They don't get along.", "Her parents are ill.", "Her partner is travelling for work."]),
        ],
      },
      {
        heading: "Section 2",
        script: [
          { speaker: "Diego", text: "Have you thought about a home daycare? My sister runs one. They're usually smaller, and some have spaces open up more often." },
          { speaker: "Lauren", text: "I didn't even think of that. Are they licensed?" },
          { speaker: "Diego", text: "Some are and some aren't. My sister's is licensed, so it's inspected every year, and families can get the government fee reduction. That's important, because otherwise it can cost twice as much." },
          { speaker: "Lauren", text: "That makes a big difference. Does she have any spaces?" },
          { speaker: "Diego", text: "She's full right now, but she's part of a network of licensed home providers. They share a list of openings. I can ask her to send you the list tonight." },
        ],
        questions: [
          q("What does Diego suggest?", "Looking at home daycares", ["Hiring a nanny", "Asking their employer for a daycare", "Changing her work hours"]),
          q("What is one advantage of a licensed home daycare?", "Families can get reduced fees.", ["It is open on weekends.", "There is no waiting list.", "It provides free meals."]),
          q("How will Diego's sister help?", "By sending a list of openings", ["By taking Lauren's son next month", "By calling Lauren's daycare", "By lowering her fees"]),
        ],
      },
      {
        heading: "Section 3",
        script: [
          { speaker: "Lauren", text: "That would be amazing. But even if I find something, there might be a gap of a week or two." },
          { speaker: "Diego", text: "Have you talked to our manager? The company lets people work from home for up to two weeks in family emergencies. Priya did it last year when her father was in hospital." },
          { speaker: "Lauren", text: "I didn't know that policy existed. I'll ask her this afternoon." },
          { speaker: "Diego", text: "Good. And send me your email so I can forward my sister's list." },
          { speaker: "Lauren", text: "Thank you so much, Diego. I feel a lot better now." },
        ],
        questions: [
          q("What company policy does Diego mention?", "Staff can work from home for two weeks in a family emergency.", ["The company pays for daycare.", "Parents can bring children to the office.", "Staff get an extra week of vacation."]),
          q("What will Lauren do this afternoon?", "Talk to her manager", ["Visit a home daycare", "Call her parents", "Email Diego's sister"]),
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- Part 2
  {
    id: "builtin-listening-part-2-dentist",
    skill: "listening",
    partId: "part-2",
    title: "Booking a dental appointment",
    source: "builtin",
    speakers: [
      { name: "Receptionist", voice: "female" },
      { name: "Patient", voice: "male" },
    ],
    sections: [
      {
        script: [
          { speaker: "Receptionist", text: "Good morning, Brightside Dental. How can I help you?" },
          { speaker: "Patient", text: "Hi, I'd like to book an appointment. I chipped one of my front teeth last night eating popcorn." },
          { speaker: "Receptionist", text: "Oh, I'm sorry. Are you in any pain?" },
          { speaker: "Patient", text: "Not really, it's just sensitive when I drink something cold. But I have a job interview on Friday, and I'm a bit embarrassed about how it looks." },
          { speaker: "Receptionist", text: "I understand. Dr. Chen has a cancellation tomorrow at eleven. Would that work?" },
          { speaker: "Patient", text: "I start work at nine, but I could take an early lunch. How long would it take?" },
          { speaker: "Receptionist", text: "For a small chip, usually about forty-five minutes. Are you a new patient with us?" },
          { speaker: "Patient", text: "Yes. I just moved here from Regina." },
          { speaker: "Receptionist", text: "Then please arrive fifteen minutes early to fill out a health form, and bring your insurance card. Most plans cover this kind of repair, but we'll check yours before we start." },
          { speaker: "Patient", text: "Perfect. Thanks very much." },
        ],
        questions: [
          q("Why is the man calling?", "He chipped a tooth.", ["He needs a routine cleaning.", "He wants to cancel an appointment.", "He has a bad toothache."]),
          q("Why does he want to be seen quickly?", "He has a job interview soon.", ["He is in a lot of pain.", "He is moving away.", "His insurance ends this week."]),
          q("How will he fit the appointment into his day?", "By taking an early lunch", ["By leaving work early", "By coming before work", "By taking the day off"]),
          q("Why must he arrive early?", "To complete a form as a new patient", ["To pay in advance", "To have an X-ray", "Because the clinic is hard to find"]),
          q("What does the receptionist say about insurance?", "They will check his coverage before starting.", ["His plan won't cover the repair.", "He must pay first and claim later.", "The clinic doesn't accept insurance."]),
        ],
      },
    ],
  },
  {
    id: "builtin-listening-part-2-pharmacy",
    skill: "listening",
    partId: "part-2",
    title: "At the pharmacy",
    source: "builtin",
    speakers: [
      { name: "Pharmacist", voice: "male" },
      { name: "Customer", voice: "female" },
    ],
    sections: [
      {
        script: [
          { speaker: "Customer", text: "Hi, I'm here to pick up a refill for my blood pressure medication. The name is Grace Okafor." },
          { speaker: "Pharmacist", text: "Let me look. Hmm, it says your prescription has no refills left. Your doctor would need to authorize a new one." },
          { speaker: "Customer", text: "Oh no. I only have two pills left, and my doctor is on vacation until next week." },
          { speaker: "Pharmacist", text: "Don't worry. In this province, pharmacists can renew some ongoing prescriptions in situations like this. I can give you enough for thirty days." },
          { speaker: "Customer", text: "That's a relief. Is there an extra charge?" },
          { speaker: "Pharmacist", text: "There's a small assessment fee of fifteen dollars, but your insurance may cover it. Before I do that, though, when did you last have your blood pressure checked?" },
          { speaker: "Customer", text: "Probably six months ago." },
          { speaker: "Pharmacist", text: "Then let's check it now. Our machine is just over there, and it only takes a minute. I'll also send a note to your doctor so she knows about the renewal." },
          { speaker: "Customer", text: "Great. And could you remind me to book a check-up with her? I always forget." },
          { speaker: "Pharmacist", text: "I'll put a note on your receipt." },
        ],
        questions: [
          q("What problem does the woman have?", "Her prescription has no refills left.", ["The pharmacy is out of her medication.", "She lost her pills.", "Her insurance card has expired."]),
          q("Why can't she contact her doctor?", "Her doctor is on vacation.", ["Her doctor has retired.", "The clinic phone is broken.", "She doesn't have a family doctor."]),
          q("What can the pharmacist do?", "Renew her prescription for 30 days", ["Give her a different medication", "Lend her two pills", "Call another doctor"]),
          q("What does the pharmacist want to do first?", "Check her blood pressure", ["See her insurance card", "Call her doctor", "Ask her to pay the fee"]),
          q("What does the woman ask the pharmacist to do?", "Remind her to book a check-up", ["Send the pills to her home", "Waive the fee", "Call her when the medicine is ready"]),
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- Part 3
  {
    id: "builtin-listening-part-3-garden",
    skill: "listening",
    partId: "part-3",
    title: "Community garden program",
    source: "builtin",
    speakers: [
      { name: "Host", voice: "male" },
      { name: "Linda", voice: "female" },
    ],
    sections: [
      {
        script: [
          { speaker: "Host", text: "This is City Spotlight. With me today is Linda Tremblay, who manages the community garden program for the city's parks department. Linda, welcome." },
          { speaker: "Linda", text: "Thanks for having me." },
          { speaker: "Host", text: "Spring is coming, and I know a lot of listeners want a garden plot. How does it work?" },
          { speaker: "Linda", text: "We have twelve community gardens across the city, with about six hundred plots in total. Each plot is three metres by six metres. Registration opens online on March first, and plots are assigned on a first-come, first-served basis." },
          { speaker: "Host", text: "And how much does a plot cost?" },
          { speaker: "Linda", text: "Forty-five dollars for the season, which runs from May to October. That includes water, compost and access to shared tools. Seniors and students pay half price." },
          { speaker: "Host", text: "What if you don't get a plot?" },
          { speaker: "Linda", text: "You go on a waiting list. Every year, about one in five gardeners doesn't renew, so people on the list often get a plot by June." },
          { speaker: "Host", text: "Are there any rules gardeners should know about?" },
          { speaker: "Linda", text: "Just a few. Plots must be planted by the end of May, and you're expected to volunteer four hours a season to help maintain common areas. We also don't allow chemical pesticides. And this year we're adding two raised-bed gardens that are accessible for people who use wheelchairs." },
          { speaker: "Host", text: "That's wonderful. Thanks, Linda." },
        ],
        questions: [
          q("When does registration open?", "March 1", ["May 1", "June 1", "October 1"]),
          q("What is included in the plot fee?", "Water, compost and shared tools", ["Seeds and plants", "Weekly gardening lessons", "A private shed"]),
          q("How much do students pay?", "$22.50", ["$45", "$15", "Nothing"]),
          q("Why do people on the waiting list often get a plot by June?", "Some gardeners don't renew each year.", ["The city builds new gardens every spring.", "Plots are shared between two people.", "The season starts late."]),
          q("What are gardeners required to do?", "Volunteer four hours during the season", ["Attend a training course", "Grow only vegetables", "Visit their plot every day"]),
          q("What is new this year?", "Raised beds for wheelchair users", ["Free plots for seniors", "A thirteenth garden", "Online plot maps"]),
        ],
      },
    ],
  },
  {
    id: "builtin-listening-part-3-winter-driving",
    skill: "listening",
    partId: "part-3",
    title: "Winter driving course",
    source: "builtin",
    speakers: [
      { name: "Host", voice: "female" },
      { name: "Marcel", voice: "male" },
    ],
    sections: [
      {
        script: [
          { speaker: "Host", text: "Welcome back. Many newcomers to Canada experience their first winter on the road this year. Marcel Dubois runs the winter driving course at Northern Lights Driving School. Marcel, who is the course for?" },
          { speaker: "Marcel", text: "Anyone who already has a licence but isn't confident in snow and ice. About half our students are newcomers from warmer countries, but we also get teenagers and even people who've driven here for years and want a refresher." },
          { speaker: "Host", text: "What does the course include?" },
          { speaker: "Marcel", text: "It's two parts. First, a three-hour classroom session on things like how to prepare your car, what to keep in an emergency kit, and how braking works on ice. Then there's a two-hour practical session on a closed track, where students practise skids and emergency stops safely." },
          { speaker: "Host", text: "That sounds exciting! What about winter tires? Are they really necessary?" },
          { speaker: "Marcel", text: "They're not required by law everywhere, but I strongly recommend them. They can shorten your stopping distance on ice by up to twenty-five percent. And many insurance companies give a five percent discount if you have them." },
          { speaker: "Host", text: "How much is the course, and when does it run?" },
          { speaker: "Marcel", text: "It's one hundred and ninety dollars. We run it on weekends from November to February. The practical session is cancelled if it's colder than minus twenty-five, but you can rebook for free." },
          { speaker: "Host", text: "Any last tip?" },
          { speaker: "Marcel", text: "Slow down and leave more space. Most winter accidents happen because people drive like it's summer." },
        ],
        questions: [
          q("Who is the course for?", "Licensed drivers who lack confidence in winter", ["People learning to drive for the first time", "Truck drivers only", "Mechanics"]),
          q("What happens in the practical session?", "Students practise skids and stops on a closed track.", ["Students drive on the highway.", "Students learn to change tires.", "Students take their licence test."]),
          q("How much can winter tires reduce stopping distance on ice?", "Up to 25 percent", ["Up to 5 percent", "Up to 50 percent", "Up to 20 percent"]),
          q("What benefit do some insurance companies offer?", "A discount for drivers with winter tires", ["Free winter tires", "A free driving course", "Lower prices for newcomers"]),
          q("What happens if it is extremely cold?", "The practical session is cancelled and can be rebooked.", ["Students get a refund.", "The class moves indoors.", "The course is extended by one day."]),
          q("What is Marcel's final advice?", "Drive more slowly and leave more space.", ["Always use winter tires.", "Avoid driving at night.", "Keep an emergency kit."]),
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- Part 4
  {
    id: "builtin-listening-part-4-bike-lanes",
    skill: "listening",
    partId: "part-4",
    title: "New bike lanes",
    source: "builtin",
    speakers: [{ name: "Newscaster", voice: "male" }],
    sections: [
      {
        script: [
          { speaker: "Newscaster", text: "In local news, construction begins next month on protected bike lanes along Elm Street, one of the busiest roads in the city. The project will add four kilometres of lanes separated from traffic by concrete curbs, connecting the university to the downtown core." },
          { speaker: "Newscaster", text: "City officials say the number of people cycling on Elm Street has doubled in the past three years, and that cyclists were involved in eleven collisions there last year. They hope the new lanes will make cycling safer and encourage more people to leave their cars at home." },
          { speaker: "Newscaster", text: "However, the project means removing about one hundred and twenty parking spaces. The Elm Street Business Association says shop owners are worried about losing customers, especially during the construction period, which is expected to last until September. To help, the city will offer free parking in two nearby municipal lots during construction." },
          { speaker: "Newscaster", text: "The lanes will cost six point five million dollars, with forty percent paid for by the federal government. The city says it will review traffic and business data one year after the lanes open." },
        ],
        questions: [
          q("What will the new bike lanes connect?", "The university and downtown", ["Two suburbs", "The airport and downtown", "Two parks"]),
          q("Why are the lanes being built?", "Cycling has increased and there have been collisions.", ["Residents complained about noise.", "The road needs repairs.", "Buses are being removed."]),
          q("What are business owners worried about?", "Losing customers because of fewer parking spaces", ["Higher property taxes", "Noise from cyclists", "The road being closed permanently"]),
          q("What will the city do to help during construction?", "Offer free parking in nearby lots", ["Lower business taxes", "Pay shop owners directly", "Build the lanes at night"]),
          q("How much of the cost will the federal government pay?", "40 percent", ["Half", "6.5 percent", "All of it"]),
        ],
      },
    ],
  },
  {
    id: "builtin-listening-part-4-heat",
    skill: "listening",
    partId: "part-4",
    title: "Heat warning",
    source: "builtin",
    speakers: [{ name: "Newscaster", voice: "female" }],
    sections: [
      {
        script: [
          { speaker: "Newscaster", text: "Environment Canada has issued a heat warning for the region, with daytime temperatures expected to reach thirty-four degrees and feel closer to forty with the humidity. The warning is expected to last at least until Thursday, and overnight temperatures will stay above twenty degrees, giving little relief." },
          { speaker: "Newscaster", text: "In response, the city is opening eight cooling centres in libraries and community centres. They will stay open until ten p.m., two hours later than usual, and all public pools will offer free swimming until the warning ends. Transit riders can also ride free to any cooling centre by showing a library card." },
          { speaker: "Newscaster", text: "Public health officials are asking residents to check on elderly neighbours, people who live alone, and anyone with heart or breathing problems. They also remind pet owners never to leave animals in parked cars, even for a few minutes." },
          { speaker: "Newscaster", text: "Hospitals say emergency visits for heat-related illness rose by thirty percent during last summer's heat wave. Officials say the most important advice is simple: drink water often, even before you feel thirsty." },
        ],
        questions: [
          q("Why is there little relief at night?", "Temperatures stay above 20 degrees.", ["The humidity rises at night.", "Cooling centres close early.", "Storms are expected."]),
          q("What has changed about the cooling centres?", "They are staying open two hours later.", ["They are opening in shopping malls.", "They now serve free meals.", "They are only for seniors."]),
          q("How can transit riders travel free to a cooling centre?", "By showing a library card", ["By showing their age", "By buying a day pass", "By calling ahead"]),
          q("Who should residents check on?", "Elderly neighbours and people who live alone", ["Children at summer camp", "Outdoor workers only", "Tourists"]),
          q("What happened during last summer's heat wave?", "Emergency visits for heat illness rose by 30 percent.", ["Several pools closed.", "Transit was free for everyone.", "Eight cooling centres were opened."]),
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- Part 5
  {
    id: "builtin-listening-part-5-fundraiser",
    skill: "listening",
    partId: "part-5",
    title: "School fundraiser",
    source: "builtin",
    speakers: [
      { name: "Karen", voice: "female" },
      { name: "Ahmed", voice: "male" },
      { name: "Julie", voice: "female" },
    ],
    sections: [
      {
        script: [
          { speaker: "Karen", text: "Okay, let's get started. The goal this year is to raise four thousand dollars for new playground equipment. We need to choose our main fundraiser tonight." },
          { speaker: "Ahmed", text: "I'd suggest a fun run. Kids collect pledges from family and friends, and it gets everyone active. The school down the road raised five thousand dollars with one last spring." },
          { speaker: "Julie", text: "A fun run is great, but it depends on the weather. If it rains, half the families won't come. What about a silent auction in the gym? Local businesses donate items, and parents bid on them during the spring concert." },
          { speaker: "Ahmed", text: "Auctions can raise a lot, but they take a huge amount of work. Someone has to contact dozens of businesses, collect the items, and organize everything." },
          { speaker: "Julie", text: "I'd be willing to lead that. I used to work in event planning." },
          { speaker: "Karen", text: "That's very generous, Julie. My concern with the auction is that it mostly depends on parents who can afford to bid. A fun run lets every family take part, even with a small pledge." },
          { speaker: "Ahmed", text: "Exactly. And we could have a rain date, maybe the following Saturday." },
          { speaker: "Julie", text: "Fair enough. What if we do both, but keep the auction small? Just ten or fifteen items at the concert, and the fun run as the main event." },
          { speaker: "Karen", text: "I like that. Ahmed, could you organize the fun run, and Julie, the mini-auction?" },
          { speaker: "Ahmed", text: "Sure. I'll need about ten parent volunteers on the day." },
          { speaker: "Julie", text: "Happy to. I'll start contacting businesses next week." },
          { speaker: "Karen", text: "Great. I'll send a note home to families on Friday asking for volunteers." },
        ],
        questions: [
          q("What is the money being raised for?", "New playground equipment", ["A school trip", "Library books", "A new gym floor"]),
          q("Why does Ahmed suggest a fun run?", "It keeps kids active and worked well at another school.", ["It requires no volunteers.", "It is cheaper than other options.", "The principal asked for it."]),
          q("What is Julie's concern about the fun run?", "Bad weather could reduce attendance.", ["Children might get hurt.", "It raises too little money.", "It takes too long to plan."]),
          q("What is Ahmed's concern about the silent auction?", "It requires a lot of organizing work.", ["Businesses won't donate.", "The gym is too small.", "Parents don't like auctions."]),
          q("Why does Julie offer to lead the auction?", "She has experience in event planning.", ["She owns a business.", "She has more free time than others.", "Her children are in the concert."]),
          q("What is Karen's concern about the auction?", "Not every family can afford to take part.", ["It might not raise enough money.", "It would conflict with the concert.", "Julie would be too busy."]),
          q("What do they finally decide?", "A fun run as the main event plus a small auction", ["Only a silent auction", "Only a fun run", "To postpone the decision"]),
          q("What will Karen do on Friday?", "Ask families for volunteers", ["Contact local businesses", "Set the rain date", "Buy the playground equipment"]),
        ],
      },
    ],
  },
  {
    id: "builtin-listening-part-5-empty-lot",
    skill: "listening",
    partId: "part-5",
    title: "The empty lot",
    source: "builtin",
    speakers: [
      { name: "Wei", voice: "male" },
      { name: "Sandra", voice: "female" },
      { name: "Paul", voice: "male" },
    ],
    sections: [
      {
        script: [
          { speaker: "Wei", text: "Thanks for coming, everyone. As you know, the city has offered our neighbourhood association the empty lot on Birch Street for three years, rent-free. We need to tell them by the end of the month what we'd like to do with it." },
          { speaker: "Sandra", text: "I think it should be a dog park. There are so many dog owners in this area, and right now people let their dogs run loose in the schoolyard, which upsets parents." },
          { speaker: "Paul", text: "I understand that, but a dog park only serves dog owners. I'd rather see a community garden. Anyone can join, and it would bring neighbours together." },
          { speaker: "Sandra", text: "A garden needs a water connection, though. Does the lot even have one?" },
          { speaker: "Wei", text: "It does. I checked with the city. But there's another issue: the lot is about thirty metres wide. That's big enough for one project, but probably not both." },
          { speaker: "Paul", text: "What if we split it? A small fenced area for dogs at the back, and garden beds near the street?" },
          { speaker: "Sandra", text: "Hmm. Dogs and vegetables side by side doesn't sound ideal. The noise and the smell could be a problem for gardeners." },
          { speaker: "Wei", text: "Here's a thought. The city mentioned that the old tennis court in Elmwood Park is unused. Sandra, what if we asked them to convert that into a dog park, and use the Birch Street lot for the garden?" },
          { speaker: "Sandra", text: "That could work, actually. The tennis court is already fenced, so it would be cheap to convert." },
          { speaker: "Paul", text: "I'd support that. I can draw up a plan for the garden." },
          { speaker: "Wei", text: "Great. I'll write to the city about both ideas this week, and Sandra, could you collect signatures from dog owners to show there's demand?" },
          { speaker: "Sandra", text: "Absolutely." },
        ],
        questions: [
          q("What has the city offered the association?", "Free use of an empty lot for three years", ["Money to build a park", "An old tennis court to buy", "A new community centre"]),
          q("Why does Sandra want a dog park?", "Dogs are running loose in the schoolyard.", ["She wants to start a dog-walking business.", "The garden would be too expensive.", "The city requested it."]),
          q("Why does Paul prefer a community garden?", "Anyone can use it, and it brings people together.", ["It is cheaper to build.", "He is a professional gardener.", "Dogs are not allowed in the area."]),
          q("What does Wei say about the size of the lot?", "It is only big enough for one project.", ["It is too small for anything.", "It could fit three projects.", "It is larger than expected."]),
          q("Why doesn't Sandra like the idea of splitting the lot?", "Dogs could disturb the gardeners.", ["Dogs would damage the fence.", "There isn't enough water.", "Gardeners don't like dogs."]),
          q("What does Wei propose?", "Using a different location for the dog park", ["Delaying the decision", "Holding a vote", "Asking for a larger lot"]),
          q("Why would the tennis court be cheap to convert?", "It already has a fence.", ["It has a water connection.", "The city will pay for it.", "It is very small."]),
          q("What will Sandra do?", "Collect signatures from dog owners", ["Draw up a plan for the garden", "Write to the city", "Fix the tennis court fence"]),
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- Part 6
  {
    id: "builtin-listening-part-6-daylight",
    skill: "listening",
    partId: "part-6",
    title: "Changing the clocks",
    source: "builtin",
    speakers: [{ name: "Presenter", voice: "female" }],
    sections: [
      {
        script: [
          { speaker: "Presenter", text: "Twice a year, most Canadians change their clocks, and twice a year, the same debate returns: should we stop? Several provinces have discussed ending the time change, but they disagree on which time to keep." },
          { speaker: "Presenter", text: "Sleep researcher Dr. Hannah Lee argues that we should stay on standard time all year, which is what we use in winter. She explains that our bodies follow the sun, and morning light helps set our internal clock. Permanent daylight time would mean that in parts of the country, the sun wouldn't rise until after nine a.m. in December. Dr. Lee says children would walk to school in the dark, and people's sleep would suffer." },
          { speaker: "Presenter", text: "On the other side, business owner Rick Saunders, who runs a golf course, wants permanent daylight time. He says longer evenings in summer bring more customers to restaurants, shops and outdoor businesses. He also points to surveys showing that most people simply prefer more light after work, when they have time to enjoy it." },
          { speaker: "Presenter", text: "There's also a practical problem. Many provinces say they will only change if their neighbours do the same, including nearby American states, because businesses don't want to be an hour off from their partners across the border." },
          { speaker: "Presenter", text: "For now, the clocks will keep changing. But a group of provincial ministers will meet in the spring to see whether they can agree on a common approach." },
        ],
        questions: [
          q("What do the provinces disagree about?", "Which time to keep if the change ends", ["Whether clocks should change three times a year", "Which day to change the clocks", "Who should pay for the change"]),
          q("Why does Dr. Lee prefer standard time?", "Morning light is important for our bodies and sleep.", ["It is better for business.", "It gives longer summer evenings.", "It is easier for computers."]),
          q("What would happen in December with permanent daylight time, according to Dr. Lee?", "The sun would rise after 9 a.m. in some places.", ["Schools would start later.", "Evenings would be shorter.", "Electricity would cost more."]),
          q("Why does Rick Saunders want permanent daylight time?", "Longer evenings bring more customers.", ["He is worried about children's safety.", "He wants to sleep longer.", "His golf course is closed in winter."]),
          q("Why are many provinces waiting for their neighbours?", "Businesses don't want to be out of sync with partners.", ["They don't have the authority to decide.", "The federal government must approve.", "Voters haven't been asked."]),
          q("What will happen in the spring?", "Provincial ministers will meet to discuss a common approach.", ["The time change will end.", "A national vote will be held.", "Clocks will change for the last time."]),
        ],
      },
    ],
  },
  {
    id: "builtin-listening-part-6-self-checkout",
    skill: "listening",
    partId: "part-6",
    title: "Self-checkout machines",
    source: "builtin",
    speakers: [{ name: "Presenter", voice: "male" }],
    sections: [
      {
        script: [
          { speaker: "Presenter", text: "If you've been grocery shopping lately, you've probably noticed more self-checkout machines and fewer cashiers. Stores say customers want speed and convenience, but not everyone is happy about the change." },
          { speaker: "Presenter", text: "Store manager Priya Natarajan says self-checkouts help during busy hours. One employee can supervise six machines, and customers with only a few items no longer wait behind large carts. She says her store hasn't laid anyone off; instead, staff have moved to jobs like preparing online orders, which have grown quickly." },
          { speaker: "Presenter", text: "But shopper and retired nurse Doreen Walsh finds the machines frustrating. She says they often stop working when an item isn't placed exactly right, and she ends up waiting for help anyway. For older customers, she adds, talking to a cashier is sometimes the only conversation they have all day." },
          { speaker: "Presenter", text: "Some stores have also run into an unexpected problem: theft. Several large chains have reported higher losses since adding self-checkouts, and one has started limiting them to customers with fifteen items or fewer." },
          { speaker: "Presenter", text: "Natarajan says her store will keep at least two staffed checkouts open at all times, and it's testing a 'slow lane' with a friendly cashier on Tuesday mornings for seniors and anyone who prefers a little extra time." },
        ],
        questions: [
          q("According to Natarajan, what is one benefit of self-checkouts?", "Customers with few items wait less.", ["They are cheaper to buy than hiring staff.", "Customers spend more money.", "They never break down."]),
          q("What has happened to staff at Natarajan's store?", "They have moved to other jobs such as online orders.", ["Many were laid off.", "They work fewer hours.", "They were trained to fix machines."]),
          q("What is Doreen Walsh's complaint about the machines?", "They often stop working, so she still needs help.", ["They are too expensive.", "They don't accept cash.", "They are too slow for large orders."]),
          q("Why does Walsh think cashiers matter for older customers?", "Talking with a cashier may be their only conversation of the day.", ["Seniors can't read the screens.", "Seniors get special discounts.", "Cashiers help carry groceries."]),
          q("What unexpected problem have some stores reported?", "More theft", ["Longer lines", "Higher electricity costs", "Fewer customers"]),
          q("What is Natarajan's store testing?", "A slower checkout lane with a cashier on Tuesday mornings", ["Removing all cashiers", "Self-checkout for large orders", "Home delivery for seniors"]),
        ],
      },
    ],
  },
];
