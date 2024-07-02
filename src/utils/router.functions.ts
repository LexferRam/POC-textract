const redirect = (route: string) => {
  const link = document.createElement("a");
  link.href = route;
  link.click();
};

export { redirect };
