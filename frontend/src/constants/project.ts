export const PROJECT = {
  filter: [
    {
      label: "Барлығы",
      value: "all",
    },
    {
      label: "Жоспарлауда",
      value: "planing",
    },
    {
      label: "Орындалуда",
      value: "in-progress",
    },
    {
      label: "Күтуде",
      value: "paused",
    },
    {
      label: "Аяқталды",
      value: "finished",
    },
  ],

  sort: [
    {
      label: "Уақыт б-ша",
      value: "time",
    },
    {
      label: "Мүше б-ша",
      value: "contributor",
    },
    {
      label: "Тапсырма б-ша",
      value: "task",
    },
    {
      label: "Прогресс б-ша",
      value: "progress",
    },
  ],

  statuses: [
    {
      label: "Жоспарлауда",
      value: 0,
    },
    {
      label: "Орындалуда",
      value: 1,
    },
    {
      label: "Күтуде",
      value: 2,
    },
    {
      label: "Аяқталды",
      value: 3,
    },
  ],
};
