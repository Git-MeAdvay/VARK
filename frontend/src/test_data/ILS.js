const ilsQuestions = [
  {
    question: "I understand something better after I",
    options: [
      { text: "try it out.", type: "ACT" },
      { text: "think it through.", type: "REF" }
    ]
  },
  {
    question: "I would rather be considered",
    options: [
      { text: "realistic.", type: "SEN" },
      { text: "innovative.", type: "INT" }
    ]
  },
  {
    question: "When I think about what I did yesterday, I am most likely to get",
    options: [
      { text: "a picture.", type: "VIS" },
      { text: "words.", type: "VRB" }
    ]
  },
  {
    question: "I tend to",
    options: [
      { text: "understand details of a subject but may be fuzzy about its overall structure.", type: "SEQ" },
      { text: "understand the overall structure but may be fuzzy about details.", type: "GLO" }
    ]
  },
  {
    question: "When I am learning something new, it helps me to",
    options: [
      { text: "talk about it.", type: "ACT" },
      { text: "think about it.", type: "REF" }
    ]
  },
  {
    question: "If I were a teacher, I would rather teach a course",
    options: [
      { text: "that deals with facts and real life situations.", type: "SEN" },
      { text: "that deals with ideas and theories.", type: "INT" }
    ]
  },
  {
    question: "I prefer to get new information in",
    options: [
      { text: "pictures, diagrams, graphs, or maps.", type: "VIS" },
      { text: "written directions or verbal information.", type: "VRB" }
    ]
  },
  {
    question: "Once I understand",
    options: [
      { text: "all the parts, I understand the whole thing.", type: "SEQ" },
      { text: "the whole thing, I see how the parts fit.", type: "GLO" }
    ]
  },
  {
    question: "In a study group working on difficult material, I am more likely to",
    options: [
      { text: "jump in and contribute ideas.", type: "ACT" },
      { text: "sit back and listen.", type: "REF" }
    ]
  },
  {
    question: "I find it easier",
    options: [
      { text: "to learn facts.", type: "SEN" },
      { text: "to learn concepts.", type: "INT" }
    ]
  },
  {
    question: "In a book with lots of pictures and charts, I am likely to",
    options: [
      { text: "look over the pictures and charts carefully.", type: "VIS" },
      { text: "focus on the written text.", type: "VRB" }
    ]
  },
  {
    question: "When I solve math problems",
    options: [
      { text: "I usually work my way to the solutions one step at a time.", type: "SEQ" },
      { text: "I often just see the solutions but then have to struggle to figure out the steps to get to them.", type: "GLO" }
    ]
  },
  {
    question: "In classes I have taken",
    options: [
      { text: "I have usually gotten to know many of the students.", type: "ACT" },
      { text: "I have rarely gotten to know many of the students.", type: "REF" }
    ]
  },
  {
    question: "In reading nonfiction, I prefer",
    options: [
      { text: "something that teaches me new facts or tells me how to do something.", type: "SEN" },
      { text: "something that gives me new ideas to think about.", type: "INT" }
    ]
  },
  {
    question: "I like teachers",
    options: [
      { text: "who put a lot of diagrams on the board.", type: "VIS" },
      { text: "who spend a lot of time explaining.", type: "VRB" }
    ]
  },
  {
    question: "When I'm analyzing a story or a novel",
    options: [
      { text: "I think of the incidents and try to put them together to figure out the themes.", type: "SEQ" },
      { text: "I just know what the themes are when I finish reading and then I have to go back and find the incidents that demonstrate them.", type: "GLO" }
    ]
  },
  {
    question: "When I start a homework problem, I am more likely to",
    options: [
      { text: "start working on the solution immediately.", type: "ACT" },
      { text: "try to fully understand the problem first.", type: "REF" }
    ]
  },
  {
    question: "I prefer the idea of",
    options: [
      { text: "certainty.", type: "SEN" },
      { text: "theory.", type: "INT" }
    ]
  },
  {
    question: "I remember best",
    options: [
      { text: "what I see.", type: "VIS" },
      { text: "what I hear.", type: "VRB" }
    ]
  },
  {
    question: "It is more important to me that an instructor",
    options: [
      { text: "lay out the material in clear sequential steps.", type: "SEQ" },
      { text: "give me an overall picture and relate the material to other subjects.", type: "GLO" }
    ]
  },
  {
    question: "I prefer to study",
    options: [
      { text: "in a study group.", type: "ACT" },
      { text: "alone.", type: "REF" }
    ]
  },
  {
    question: "I am more likely to be considered",
    options: [
      { text: "careful about the details of my work.", type: "SEN" },
      { text: "creative about how to do my work.", type: "INT" }
    ]
  },
  {
    question: "When I get directions to a new place, I prefer",
    options: [
      { text: "a map.", type: "VIS" },
      { text: "written directions.", type: "VRB" }
    ]
  },
  {
    question: "I learn",
    options: [
      { text: "at a fairly regular pace. If I study hard, I'll \"get it.\"", type: "SEQ" },
      { text: "in fits and starts. I'll be totally confused and then suddenly it all \"clicks.\"", type: "GLO" }
    ]
  },
  {
    question: "I would rather first",
    options: [
      { text: "try things out.", type: "ACT" },
      { text: "think about how I'm going to do it.", type: "REF" }
    ]
  },
  {
    question: "When I am reading for enjoyment, I like writers to",
    options: [
      { text: "clearly say what they mean.", type: "SEN" },
      { text: "say things in creative, interesting ways.", type: "INT" }
    ]
  },
  {
    question: "When I see a diagram or sketch in class, I am most likely to remember",
    options: [
      { text: "the picture.", type: "VIS" },
      { text: "what the instructor said about it.", type: "VRB" }
    ]
  },
  {
    question: "When considering a body of information, I am more likely to",
    options: [
      { text: "focus on details and miss the big picture.", type: "SEQ" },
      { text: "try to understand the big picture before getting into the details.", type: "GLO" }
    ]
  },
  {
    question: "I more easily remember",
    options: [
      { text: "something I have done.", type: "ACT" },
      { text: "something I have thought a lot about.", type: "REF" }
    ]
  },
  {
    question: "When I have to perform a task, I prefer to",
    options: [
      { text: "master one way of doing it.", type: "SEN" },
      { text: "come up with new ways of doing it.", type: "INT" }
    ]
  },
  {
    question: "When someone is showing me data, I prefer",
    options: [
      { text: "charts or graphs.", type: "VIS" },
      { text: "text summarizing the results.", type: "VRB" }
    ]
  },
  {
    question: "When writing a paper, I am more likely to",
    options: [
      { text: "work on (think about or write) the beginning of the paper and progress forward.", type: "SEQ" },
      { text: "work on (think about or write) different parts of the paper and then order them.", type: "GLO" }
    ]
  },
  {
    question: "When I have to work on a group project, I first want to",
    options: [
      { text: "have \"group brainstorming\" where everyone contributes ideas.", type: "ACT" },
      { text: "brainstorm individually and then come together as a group to compare ideas.", type: "REF" }
    ]
  },
  {
    question: "I consider it higher praise to call someone",
    options: [
      { text: "sensible.", type: "SEN" },
      { text: "imaginative.", type: "INT" }
    ]
  },
  {
    question: "When I meet people at a party, I am more likely to remember",
    options: [
      { text: "what they looked like.", type: "VIS" },
      { text: "what they said about themselves.", type: "VRB" }
    ]
  },
  {
    question: "When I am learning a new subject, I prefer to",
    options: [
      { text: "stay focused on that subject, learning as much about it as I can.", type: "SEQ" },
      { text: "try to make connections between that subject and related subjects.", type: "GLO" }
    ]
  },
  {
    question: "I am more likely to be considered",
    options: [
      { text: "outgoing.", type: "ACT" },
      { text: "reserved.", type: "REF" }
    ]
  },
  {
    question: "I prefer courses that emphasize",
    options: [
      { text: "concrete material (facts, data).", type: "SEN" },
      { text: "abstract material (concepts, theories).", type: "INT" }
    ]
  },
  {
    question: "For entertainment, I would rather",
    options: [
      { text: "watch television.", type: "VIS" },
      { text: "read a book.", type: "VRB" }
    ]
  },
  {
    question: "Some teachers start their lectures with an outline of what they will cover. Such outlines are",
    options: [
      { text: "somewhat helpful to me.", type: "SEQ" },
      { text: "very helpful to me.", type: "GLO" }
    ]
  },
  {
    question: "The idea of doing homework in groups, with one grade for the entire group,",
    options: [
      { text: "appeals to me.", type: "ACT" },
      { text: "does not appeal to me.", type: "REF" }
    ]
  },
  {
    question: "When I am doing long calculations,",
    options: [
      { text: "I tend to repeat all my steps and check my work carefully.", type: "SEN" },
      { text: "I find checking my work tiresome and have to force myself to do it.", type: "INT" }
    ]
  },
  {
    question: "I tend to picture places I have been",
    options: [
      { text: "easily and fairly accurately.", type: "VIS" },
      { text: "with difficulty and without much detail.", type: "VRB" }
    ]
  },
  {
    question: "When solving problems in a group, I would be more likely to",
    options: [
      { text: "think of the steps in the solutions process.", type: "SEQ" },
      { text: "think of possible consequences or applications of the solution in a wide range of areas.", type: "GLO" }
    ]
  }
];