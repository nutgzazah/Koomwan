export const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
};