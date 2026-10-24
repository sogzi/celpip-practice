// Additional built-in Reading tests (Tests 2 and 3 for each part).
import type { TestSet } from "./rl";
import { p, q } from "./rl-q";

export const moreReading: TestSet[] = [
  // ---------------------------------------------------------------- Part 1
  {
    id: "builtin-reading-part-1-cottage",
    skill: "reading",
    partId: "part-1",
    title: "Cottage weekend",
    source: "builtin",
    sections: [
      {
        heading: "Message",
        instructions: "Read the following message.",
        text: `Hi Jen,

I hope your first week back at school went well! Mine was chaotic, but I finally have a quiet evening, so I'm writing about the cottage.

As you know, Mom and Dad have rented the same cottage on Lake Muskoka for the long weekend in September, and they want all of us there. I'm happy to go, but I'm a little worried about the sleeping arrangements. The cottage only has three bedrooms, and with you, me, Andrew, the kids and our parents, someone will end up on the pull-out couch again. Last year it was me, and my back hurt for a week.

I had an idea. There's a small campground about five minutes down the road. Andrew and the kids would love to sleep in a tent, and that would free up a bedroom. We'd still eat all our meals at the cottage and spend the days together on the dock. I just don't want Mom to think we're avoiding everyone. You know how sensitive she can be about family time.

Could you mention the idea to her before I do? She always listens to you. Also, I'm planning the Saturday dinner. Would you be willing to bring dessert? Your apple crumble is still everyone's favourite.

Talk soon,
Megan`,
        questions: [
          q("Why is Megan writing to Jen?", "To discuss plans for a family weekend at a cottage", ["To invite Jen to her school", "To complain about her parents", "To ask Jen to rent a cottage"], "The whole message is about the September cottage weekend."),
          q("What problem does Megan see with the cottage?", "There aren't enough bedrooms for everyone.", ["It is too far from the lake.", "It is too expensive.", "It has no kitchen."], "“The cottage only has three bedrooms… someone will end up on the pull-out couch.”"),
          q("What happened to Megan last year?", "She slept on the couch and hurt her back.", ["She missed the weekend.", "She got sick at the campground.", "She argued with her mother."], "“Last year it was me, and my back hurt for a week.”"),
          q("What does Megan suggest?", "That her husband and children sleep at a nearby campground", ["That the family rent a bigger cottage", "That she stay home this year", "That everyone camp instead of using the cottage"], "Andrew and the kids would sleep in a tent at the campground."),
          q("Why does Megan want Jen to speak to their mother first?", "Their mother may feel hurt, and she listens to Jen.", ["Megan and her mother aren't speaking.", "Jen is organizing the weekend.", "Jen knows the campground owner."], "Mom is “sensitive… about family time” and “always listens to you.”"),
          q("What does Megan ask Jen to bring?", "A dessert", ["A tent", "The Saturday dinner", "Extra blankets"], "“Would you be willing to bring dessert?”"),
        ],
      },
      {
        heading: "Reply",
        instructions: "Here is Jen's reply. Choose the best option for each blank.",
        text: `Hi Megan,

The camping idea is great. I spoke to Mom last night, and she was more (7) ______ than I expected. She actually laughed and said Dad snores too loudly for anyone to sleep near him anyway!

She did ask one thing: she wants everyone at the cottage for breakfast, not just dinner. I told her that wouldn't be a (8) ______, since the campground is so close.

Of course I'll bring the apple crumble. I'll make it on Friday so it has time to (9) ______ before the drive. Should I bring ice cream too, or will you have room in the cottage freezer?

One more thing: the weather forecast for that weekend isn't great. Tell Andrew to pack a tent that can (10) ______ heavy rain, or the kids will end up on the couch after all!

I'm really looking forward to it. It's been (11) ______ since we were all together.

Love,
Jen`,
        questions: [
          q("Blank 7", "understanding", ["upset", "confused", "nervous"], "Megan feared Mom would be hurt, but she “actually laughed.”"),
          q("Blank 8", "problem", ["surprise", "secret", "reason"], "The campground is close, so breakfast at the cottage is easy."),
          q("Blank 9", "cool", ["melt", "bake", "grow"], "She bakes it a day early so it cools before travelling."),
          q("Blank 10", "handle", ["avoid", "cause", "predict"], "The tent must cope with heavy rain."),
          q("Blank 11", "ages", ["minutes", "easy", "early"], "She is looking forward to seeing everyone after a long time."),
        ],
      },
    ],
  },
  {
    id: "builtin-reading-part-1-puppy",
    skill: "reading",
    partId: "part-1",
    title: "A new puppy",
    source: "builtin",
    sections: [
      {
        heading: "Message",
        instructions: "Read the following message.",
        text: `Dear Samir,

You won't believe it, but we finally did it: we adopted a dog! Her name is Maple, and she's a two-year-old mix from the animal shelter in Kitchener. The staff think she's part husky, which explains why she howls whenever someone leaves the house.

The kids are thrilled, and so am I, mostly. The first week has been harder than I expected. Maple is sweet and calm with people, but she pulls hard on her leash and barks at every other dog we pass. Yesterday she pulled Leo right off the sidewalk into a snowbank. He thought it was hilarious, but I didn't.

The bigger challenge is our schedule. Sunita and I both go back to the office three days a week starting next month, and the kids are at school until 3:30. That means Maple would be alone for almost nine hours on those days. The shelter told us that's too long for her, especially since she's still getting used to us.

Since you've had dogs your whole life, I was hoping you could help. Did you ever use a dog walker or a doggy daycare? And do you know a good trainer who could help with the pulling? I've read that group classes are cheaper, but I'm not sure Maple is ready to be around other dogs.

Thanks in advance, and come meet her soon!

Daniel`,
        questions: [
          q("Where did Daniel's family get Maple?", "From an animal shelter", ["From a breeder", "From a neighbour", "From a pet store"], "“A two-year-old mix from the animal shelter in Kitchener.”"),
          q("Why do the shelter staff think Maple is part husky?", "She howls when people leave.", ["She loves snow.", "She pulls on her leash.", "She is very calm."], "“Which explains why she howls whenever someone leaves the house.”"),
          q("How did Daniel feel when Leo fell into the snowbank?", "He did not find it funny.", ["He laughed with Leo.", "He was proud of Maple.", "He didn't notice."], "“He thought it was hilarious, but I didn't.”"),
          q("What is Daniel's biggest concern?", "Maple will be alone too long on office days.", ["Maple doesn't like the children.", "The shelter wants Maple back.", "Maple costs too much to feed."], "“The bigger challenge is our schedule… alone for almost nine hours.”"),
          q("Why is Daniel unsure about group training classes?", "Maple reacts badly to other dogs.", ["They are too expensive.", "They are too far away.", "They are only for puppies."], "She “barks at every other dog,” so he is “not sure Maple is ready.”"),
          q("What does Daniel ask Samir for?", "Advice and recommendations about dog care and training", ["To look after Maple for a month", "To adopt a second dog", "To drive the kids to school"], "He asks about dog walkers, daycare and a trainer."),
        ],
      },
      {
        heading: "Reply",
        instructions: "Here is Samir's reply. Choose the best option for each blank.",
        text: `Hi Daniel,

Congratulations! Maple sounds wonderful, and the first few weeks are always the (7) ______, so don't worry.

For your office days, I'd suggest a dog walker rather than a daycare. Daycares are great for social dogs, but since Maple gets (8) ______ around other dogs, a quiet walk in the middle of the day would suit her better. My neighbour Claire walks dogs in your area and only takes one dog at a time.

As for the pulling, private lessons cost more, but they'd let Maple learn without (9) ______. Try Paws Forward Training. They helped my dog Rocky, who used to be much (10) ______ than Maple!

Finally, it's normal for a shelter dog to howl at first. Leaving a radio on can help her feel less (11) ______.

I'd love to meet her. How about Sunday afternoon?

Samir`,
        questions: [
          q("Blank 7", "hardest", ["easiest", "shortest", "cheapest"], "Daniel said the first week was harder than expected."),
          q("Blank 8", "excited", ["bored", "sleepy", "hungry"], "She barks at other dogs, so a busy daycare is a poor fit."),
          q("Blank 9", "distractions", ["treats", "exercise", "a leash"], "Private lessons avoid other dogs, which distract her."),
          q("Blank 10", "worse", ["smaller", "quieter", "younger"], "Rocky improved from a worse starting point, which encourages Daniel."),
          q("Blank 11", "lonely", ["hungry", "tired", "playful"], "The radio helps when she's left alone."),
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- Part 2
  {
    id: "builtin-reading-part-2-ski",
    skill: "reading",
    partId: "part-2",
    title: "Ski hill day trip",
    source: "builtin",
    sections: [
      {
        heading: "Diagram and email",
        instructions: "Read the price list and the email, then answer the questions.",
        table: {
          title: "Pine Ridge Ski Hill: Winter Rates",
          headers: ["Option", "Weekday", "Weekend", "Includes"],
          rows: [
            ["Adult lift ticket (18+)", "$58", "$72", "Full day, all lifts"],
            ["Youth lift ticket (6–17)", "$42", "$52", "Full day, all lifts"],
            ["Beginner package", "$65", "$80", "1-hour group lesson, rentals, beginner lift only"],
            ["Equipment rental", "$35", "$35", "Skis or snowboard, boots, helmet"],
            ["Night skiing (4–9 pm)", "$30", "$30", "Selected lifts, Tue–Sat only"],
          ],
          note: "Children under 6 ski free with a paying adult. Groups of 10 or more save 15% on lift tickets when booked online 48 hours in advance.",
        },
        text: `Hi Farah,

I've looked into Pine Ridge for our trip with the kids. Since Ayaan has never skied before, I think the (1) ______ makes the most sense for him. It includes a lesson and everything he needs, although he'll only be able to use the (2) ______ lift.

Zara has her own skis, so she just needs a youth ticket. If we go on a Saturday, hers will be (3) ______. You and I could each get an adult ticket and rent equipment.

Another option is to go after work on a weeknight. Night skiing is much cheaper, but it isn't offered on (4) ______, which is the only evening I'm free.

Your little one, Noor, is only four, so she can come along for (5) ______.

Let me know what you think!
Imran`,
        questions: [
          q("Blank 1", "beginner package", ["equipment rental", "night skiing pass", "youth lift ticket"], "The beginner package includes a lesson and rentals."),
          q("Blank 2", "beginner", ["night", "main", "youth"], "Beginner package: “beginner lift only.”"),
          q("Blank 3", "$52", ["$42", "$72", "$80"], "Youth weekend ticket is $52."),
          q("Blank 4", "Mondays", ["Saturdays", "Tuesdays", "Fridays"], "Night skiing runs Tuesday to Saturday only, so not Monday or Sunday."),
          q("Blank 5", "free", ["$30", "half price", "$42"], "Children under 6 ski free with a paying adult."),
          q("On a Saturday, how much would Imran pay for an adult ticket plus equipment rental?", "$107", ["$93", "$72", "$115"], "$72 weekend ticket + $35 rental = $107."),
          q("What would make the lift tickets cheaper for a large group?", "Booking online at least two days ahead for 10 or more people", ["Going on a weekday after 4 pm", "Bringing children under 6", "Buying rentals and tickets together"], "Groups of 10+ save 15% when booked online 48 hours ahead."),
          q("Why doesn't Zara need the equipment rental?", "She already owns skis.", ["She is under 6.", "Her ticket includes rentals.", "She will take a lesson."], "“Zara has her own skis.”"),
        ],
      },
    ],
  },
  {
    id: "builtin-reading-part-2-truck",
    skill: "reading",
    partId: "part-2",
    title: "Renting a moving truck",
    source: "builtin",
    sections: [
      {
        heading: "Diagram and email",
        instructions: "Read the rental chart and the email, then answer the questions.",
        table: {
          title: "Northway Truck Rentals: Local Moves",
          headers: ["Vehicle", "Best for", "Daily rate", "Per km", "Extras"],
          rows: [
            ["Cargo van", "Studio or dorm room", "$39", "$0.79", "Fits in regular parking spots"],
            ["10-foot truck", "1-bedroom apartment", "$49", "$0.89", "Loading ramp"],
            ["15-foot truck", "2-bedroom home", "$69", "$0.99", "Loading ramp, 3 seats"],
            ["20-foot truck", "3–4 bedroom home", "$89", "$1.09", "Loading ramp, 3 seats"],
            ["Furniture dolly", "Any move", "$12", "n/a", "Moving blankets $2 each"],
          ],
          note: "Returning a vehicle more than 2 hours late adds a second day. Students with valid ID get 10% off the daily rate (not the kilometre charge).",
        },
        text: `Hi Kenji,

Thanks again for offering to help me move on Saturday! I've decided to rent from Northway. My new place has two bedrooms, so I'll need the (1) ______. It's a bit more expensive than the 10-foot truck, but it has (2) ______ seats, so you and Leah can ride with me instead of following in your car.

The daily rate is (3) ______, and the kilometre charge will be small because my new apartment is only about 20 km away. I'll also rent a (4) ______ for the fridge and washing machine, plus a few blankets to protect the furniture.

The truck has to be back by 6 pm. If we're more than two hours late, I'll be charged for (5) ______, so let's try to start early. I'll bring coffee and doughnuts!

Talk soon,
Mira`,
        questions: [
          q("Blank 1", "15-foot truck", ["10-foot truck", "cargo van", "20-foot truck"], "The 15-foot truck is best for a 2-bedroom home."),
          q("Blank 2", "three", ["two", "four", "five"], "The 15-foot truck has 3 seats."),
          q("Blank 3", "$69", ["$49", "$89", "$0.99"], "15-foot truck daily rate: $69."),
          q("Blank 4", "furniture dolly", ["cargo van", "loading ramp", "second truck"], "A dolly helps move heavy appliances."),
          q("Blank 5", "a second day", ["a late fee of $12", "the blankets", "extra kilometres"], "Returning more than 2 hours late adds a second day."),
          q("If Mira drives 40 km in total, what will the kilometre charge be?", "$39.60", ["$35.60", "$43.60", "$19.80"], "40 km × $0.99 = $39.60."),
          q("Which vehicle can be parked in an ordinary parking space?", "The cargo van", ["The 10-foot truck", "The 15-foot truck", "All of them"], "Cargo van: “Fits in regular parking spots.”"),
          q("If Mira were a student, how much would she save on the daily rate?", "$6.90", ["$3.96", "$10.00", "Nothing, because the discount is only for kilometres"], "10% of $69 is $6.90; the discount doesn't apply to the kilometre charge."),
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- Part 3
  {
    id: "builtin-reading-part-3-tiny-homes",
    skill: "reading",
    partId: "part-3",
    title: "Tiny homes",
    source: "builtin",
    sections: [
      {
        heading: "Article",
        instructions: "Decide which paragraph (A–D) contains each piece of information. Choose E if the information is not given.",
        text: `A. Tiny homes, usually defined as houses smaller than 40 square metres, have become a popular topic on social media. Their supporters describe a simpler life with lower bills and fewer possessions. In Canada, interest grew sharply as housing prices rose, and several companies now build tiny homes in factories and deliver them on trailers. A basic model can cost less than a quarter of the price of a typical detached house.

B. Living in such a small space requires careful planning. Most tiny homes have a sleeping loft reached by a ladder, a fold-down table and stairs with storage built into every step. Owners say the biggest adjustment is not the size of the rooms but deciding what to keep. Many report giving away more than half of their belongings before moving in, and some admit they found the process emotional.

C. The greatest obstacle, however, is finding somewhere legal to put a tiny home. Many municipalities have minimum size requirements for houses, and placing a home on wheels in a backyard is often not allowed for permanent living. Owners also struggle to get mortgages and insurance, because banks may treat tiny homes like vehicles rather than real estate.

D. Some cities are beginning to change their rules. A few now allow small "garden suites" behind existing houses, which can be rented out or used for aging parents. Planners see them as a way to add housing without building tall apartment towers. Critics worry about parking and crowding on residential streets, but early projects have generally been well received by neighbours.`,
        questions: [
          p("Many owners had to give away a large part of what they owned.", "B", "“Giving away more than half of their belongings.”"),
          p("Tiny homes can be much cheaper than ordinary houses.", "A", "“Less than a quarter of the price of a typical detached house.”"),
          p("Financial institutions may not treat tiny homes like normal houses.", "C", "Banks “may treat tiny homes like vehicles rather than real estate.”"),
          p("Small homes behind existing houses can provide space for older relatives.", "D", "Garden suites can be “used for aging parents.”"),
          p("Tiny homes are more popular in Canada than in the United States.", "E", "No comparison with the United States is made."),
          p("Local rules about minimum house size can stop people from living in tiny homes.", "C", "“Many municipalities have minimum size requirements.”"),
          p("Furniture in tiny homes is often designed to serve more than one purpose.", "B", "Fold-down tables and stairs with built-in storage."),
          p("Neighbours have mostly reacted positively to new small homes.", "D", "“Early projects have generally been well received by neighbours.”"),
          p("Some tiny homes are made in factories and transported to their location.", "A", "Companies “build tiny homes in factories and deliver them on trailers.”"),
        ],
      },
    ],
  },
  {
    id: "builtin-reading-part-3-small-towns",
    skill: "reading",
    partId: "part-3",
    title: "Remote workers in small towns",
    source: "builtin",
    sections: [
      {
        heading: "Article",
        instructions: "Decide which paragraph (A–D) contains each piece of information. Choose E if the information is not given.",
        text: `A. For decades, young Canadians left small towns to find work in big cities. Since remote work became common, that pattern has started to reverse in some regions. Towns in Nova Scotia, Northern Ontario and the interior of British Columbia have reported new residents who keep their city jobs but work from home. Many say they were attracted by lower housing costs, shorter commutes and easier access to nature.

B. Some towns have actively recruited these newcomers. Programs offer welcome packages, free memberships at local gyms or a few months of free office space in a shared workspace downtown. One town in Saskatchewan even organizes a "trial weekend," where families can stay for free, meet local business owners and tour available homes before deciding to move.

C. Not everything has gone smoothly. In several communities, the arrival of remote workers has pushed up house prices and rents, making it harder for long-time residents, especially young people, to stay. Slow internet is another frequent complaint; in some rural areas, video calls freeze so often that newcomers end up working from the local library.

D. Experts say the long-term effect depends on whether newcomers become part of the community. Those who volunteer, send their children to local schools and shop at local businesses tend to stay longer. Others return to the city within two years, often because they miss friends and family or because their employer asks staff to come back to the office.`,
        questions: [
          p("Some towns let families visit for free before moving.", "B", "The Saskatchewan “trial weekend.”"),
          p("Housing has become less affordable for some people who already lived in these towns.", "C", "Prices rose, “making it harder for long-time residents… to stay.”"),
          p("Newcomers who get involved locally are more likely to remain.", "D", "Those who volunteer and shop locally “tend to stay longer.”"),
          p("In the past, young people commonly moved from small towns to cities.", "A", "“Young Canadians left small towns to find work in big cities.”"),
          p("Poor internet service forces some people to work in public buildings.", "C", "Newcomers “end up working from the local library.”"),
          p("Remote workers in small towns earn higher salaries than local workers.", "E", "Salaries are not compared."),
          p("Some people go back to the city when their company wants them in the office.", "D", "“Their employer asks staff to come back to the office.”"),
          p("Being close to the outdoors is one reason people move.", "A", "“Easier access to nature.”"),
          p("Free workspace is offered as an incentive in some towns.", "B", "“A few months of free office space in a shared workspace.”"),
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- Part 4
  {
    id: "builtin-reading-part-4-library-fines",
    skill: "reading",
    partId: "part-4",
    title: "Ending library late fees",
    source: "builtin",
    sections: [
      {
        heading: "Article",
        instructions: "Read the article and answer the questions.",
        text: `Should libraries stop charging late fees?

Last January, the Maplewood Public Library stopped charging fines for overdue books. A year later, the library board must decide whether to keep the policy, and the debate has been surprisingly passionate.

Head librarian Joanne Mercier says the results speak for themselves. "Before the change, almost 4,000 cardholders were blocked from borrowing because they owed money, many of them children," she explains. "Since we removed fines, more than a thousand of those people have come back." According to Mercier, the fines brought in about $45,000 a year, but collecting them cost the library nearly half that amount in staff time and administration. "We were spending money to keep people away," she says.

Mercier adds that most books still come back. Borrowers receive email reminders, and if an item is more than six weeks late, they must pay for a replacement before borrowing again.

Not everyone is convinced. City councillor Doug Fenwick argues that fines teach responsibility. "When there's no consequence, people keep popular books for weeks while others wait," he says. He points to the library's own figures, which show that the waiting time for new bestsellers increased from three weeks to five after fines were removed. Fenwick believes a small fine of ten cents a day would be fairer than charging nothing.

Some regular users agree with him. Retired teacher Helen Park, who visits the library twice a week, says she has been waiting more than two months for a popular novel. "I return my books on time," she says. "Why should I wait longer because someone else doesn't?"

Mercier says the library is considering a compromise: shorter loan periods for the newest and most requested titles, while keeping all other items fine-free. The board will vote next month.`,
        questions: [
          q("Why did many people stop using the library before the policy changed?", "They owed fines and could not borrow.", ["The library reduced its hours.", "Books were too expensive to replace.", "They preferred e-books."], "Almost 4,000 cardholders “were blocked from borrowing because they owed money.”"),
          q("What does Mercier mean by “We were spending money to keep people away”?", "Collecting fines cost money and also discouraged borrowers.", ["The library spent too much on advertising.", "Staff were paid to stand at the door.", "New books were too expensive."], "Collecting fines cost nearly half of what they raised and blocked users."),
          q("What happens if a book is more than six weeks late?", "The borrower must pay for a replacement before borrowing again.", ["The borrower pays ten cents a day.", "The borrower's card is cancelled.", "Nothing happens."], "“They must pay for a replacement before borrowing again.”"),
          q("What evidence does Fenwick use?", "Waiting times for bestsellers have become longer.", ["Fewer people visit the library.", "Many books have been stolen.", "The library lost $45,000."], "Waiting time increased from three to five weeks."),
          q("What is Helen Park's main complaint?", "She waits longer because others keep books too long.", ["She can't afford fines.", "The library is closed too often.", "She doesn't get email reminders."], "“Why should I wait longer because someone else doesn't?”"),
        ],
      },
      {
        heading: "Reader comment",
        instructions: "A reader posted this comment. Choose the best option for each blank.",
        text: `As a single parent of three, I want to thank the library for removing late fees. Two years ago, my children's cards were (6) ______ because we owed almost forty dollars, and I simply couldn't afford to pay it. Now my kids borrow books every week.

I understand Ms. Park's (7) ______. Waiting two months for a book is frustrating. But bringing back fines would punish families like mine to solve a problem that only affects the most (8) ______ titles.

That's why I support the library's (9) ______. Shorter loans for new bestsellers make sense, and they would reduce waiting times without (10) ______ the people who need the library most.`,
        questions: [
          q("Blank 6", "blocked", ["renewed", "upgraded", "returned"], "Cardholders who owed money were blocked from borrowing."),
          q("Blank 7", "frustration", ["generosity", "decision", "success"], "She has been waiting over two months."),
          q("Blank 8", "popular", ["damaged", "expensive", "old"], "The problem is waiting lists for bestsellers."),
          q("Blank 9", "compromise", ["original fines", "closing", "budget cut"], "The proposal: shorter loans for new titles, other items fine-free."),
          q("Blank 10", "excluding", ["helping", "inviting", "rewarding"], "The point is to avoid shutting out families who can't pay."),
        ],
      },
    ],
  },
  {
    id: "builtin-reading-part-4-chickens",
    skill: "reading",
    partId: "part-4",
    title: "Backyard chickens",
    source: "builtin",
    sections: [
      {
        heading: "Article",
        instructions: "Read the article and answer the questions.",
        text: `Backyard chickens divide Cedar Falls

A proposal to allow residents of Cedar Falls to keep chickens in their backyards has drawn one of the largest crowds city council has seen in years. Under the plan, households could keep up to four hens, but no roosters, in a coop at least three metres from neighbouring properties.

The idea came from resident Marisol Ortega, who collected more than 1,200 signatures. "Food prices have gone up so much, and families want to know where their food comes from," she says. "Four hens can give a family about two dozen eggs a week. It also teaches kids responsibility." Ortega notes that nearby cities such as Riverton have allowed backyard hens for five years with few complaints.

Others are worried. Veterinarian Dr. Paul Laurent supports the idea in principle but warns that many people underestimate the work involved. "Chickens need shelter from minus-thirty winters, regular cleaning and care when they get sick, and very few vets in the area treat birds," he says. He would like owners to complete a short course before getting a permit.

The strongest opposition comes from homeowners concerned about smells, noise and pests. Retired engineer Frank Dobson, whose small backyard is surrounded by six neighbours, says even quiet hens attract rats and raccoons. "Riverton has large lots," he says. "Our houses are much closer together." He also questions who will enforce the rules, since the city has only two bylaw officers.

Council has proposed a two-year pilot limited to 50 permits, each costing $40, with an inspection before approval. The fees would pay for a part-time officer to handle complaints. A decision is expected in June.`,
        questions: [
          q("What would the proposal allow?", "Up to four hens per household, with no roosters", ["Any number of chickens on large lots", "Roosters only in rural areas", "Chickens inside homes"], "“Households could keep up to four hens, but no roosters.”"),
          q("Why does Ortega mention Riverton?", "To show that a similar policy has worked elsewhere", ["To complain about Riverton's food prices", "To suggest moving the chickens there", "To compare the size of the two councils"], "Riverton has allowed hens for five years “with few complaints.”"),
          q("What is Dr. Laurent's position?", "He supports the idea but wants owners trained first.", ["He completely opposes the idea.", "He wants to sell chickens to residents.", "He thinks roosters should be allowed."], "He supports it “in principle” and wants a short course before permits."),
          q("Why does Dobson think Riverton is not a good comparison?", "Houses in Cedar Falls are closer together.", ["Riverton has more bylaw officers.", "Riverton's winters are milder.", "Riverton banned chickens last year."], "“Riverton has large lots… Our houses are much closer together.”"),
          q("How would the city pay for handling complaints?", "With permit fees", ["With a new property tax", "With a provincial grant", "With fines on egg sales"], "“The fees would pay for a part-time officer.”"),
        ],
      },
      {
        heading: "Reader comment",
        instructions: "A reader posted this comment. Choose the best option for each blank.",
        text: `I live next door to a family in Riverton who keeps hens, and I've never had a problem. In fact, they give me fresh eggs every week! So I disagree with Mr. Dobson that chickens (6) ______ attract rats. Pests come when food is left out, and responsible owners store feed in sealed containers.

That said, I agree with Dr. Laurent that owners should be (7) ______. My neighbours took a course and they still say the first winter was (8) ______.

The council's pilot seems like a sensible way to test the idea. Limiting it to 50 permits means problems will stay (9) ______, and the inspection will make sure coops are built properly. If complaints are low after two years, the city can (10) ______ the program.`,
        questions: [
          q("Blank 6", "always", ["never", "rarely", "quietly"], "She disagrees that chickens automatically attract pests."),
          q("Blank 7", "trained", ["fined", "elected", "paid"], "Dr. Laurent wants a course before a permit."),
          q("Blank 8", "challenging", ["relaxing", "unnecessary", "boring"], "Laurent said chickens need shelter from very cold winters."),
          q("Blank 9", "small", ["hidden", "expensive", "permanent"], "With only 50 permits, any problems will be limited."),
          q("Blank 10", "expand", ["cancel", "hide", "forget"], "If complaints are low, the program could grow."),
        ],
      },
    ],
  },
];
