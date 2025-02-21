export const levels = [
    {
      name: "Novello",
      minWines: 0,
      maxWines: 50,
      description: "Sei agli inizi, ma ogni grande esperto parte da qui!",
    },
    {
      name: "IGT",
      minWines: 51,
      maxWines: 150,
      description: "Stai scoprendo i sapori delle diverse regioni.",
    },
    {
      name: "DOC",
      minWines: 151,
      maxWines: 300,
      description: "Vini di qualità superiore, per palati più esigenti.",
    },
    {
        name: "DOCG",
        minWines: 301,
        maxWines: 500,
        description: "Vini di qualità superiore, per palati più esigenti.",
    },
    {
        name: "CRU Classé",
        minWines: 501,
        maxWines: 750,
        description: "Vini di qualità superiore, per palati più esigenti.",
    },
    {
        name: "Premier Cru",
        minWines: 751,
        maxWines: 1000,
        description: "Vini di qualità superiore, per palati più esigenti.",
    },
    {
        name: "Grand Premier Cru",
        minWines: 1000,
        maxWines: 1000000,
        description: "Vini di qualità superiore, per palati più esigenti.",
    },
  ];
  
  export const getLevel = (totalWines: number) => {
    return levels.find(
      (level) => totalWines >= level.minWines && totalWines <= level.maxWines
    );
  };