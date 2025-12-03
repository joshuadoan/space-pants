const alienPrefixes = [
  "Xyl",
  "Zeph",
  "Kryp",
  "Vort",
  "Nex",
  "Quor",
  "Zyl",
  "Vex",
  "Krax",
  "Zyph",
  "Qor",
  "Nyx",
  "Vyr",
  "Kyl",
  "Zor",
  "Xen",
  "Kyr",
  "Vyl",
  "Nox",
  "Qyx",
  "Zyr",
  "Kyl",
  "Vex",
  "Nyr",
  "Qor",
  "Xyl",
  "Kryp",
  "Zeph",
  "Vort",
  "Nex",
];

const alienSuffixes = [
  "thar",
  "xion",
  "zoid",
  "vorn",
  "kith",
  "qor",
  "zyl",
  "vex",
  "krax",
  "zyph",
  "qor",
  "nyx",
  "vyr",
  "kyl",
  "zor",
  "xen",
  "kyr",
  "vyl",
  "nox",
  "qyx",
  "zyr",
  "kyl",
  "vex",
  "nyr",
  "qor",
  "thar",
  "xion",
  "zoid",
  "vorn",
  "kith",
];

const alienMiddleParts = [
  "ak",
  "ek",
  "ik",
  "ok",
  "uk",
  "ar",
  "er",
  "ir",
  "or",
  "ur",
  "al",
  "el",
  "il",
  "ol",
  "ul",
  "an",
  "en",
  "in",
  "on",
  "un",
];

const alienDescriptors = [
  "Prime",
  "Alpha",
  "Beta",
  "Gamma",
  "Delta",
  "Epsilon",
  "Zeta",
  "Theta",
  "Lambda",
  "Sigma",
  "Omega",
  "Nexus",
  "Vortex",
  "Quantum",
  "Nebula",
  "Stellar",
  "Cosmic",
  "Void",
  "Astral",
  "Celestial",
];

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function generateSpaceName(): string {
  const pattern = Math.floor(Math.random() * 4);
  
  switch (pattern) {
    case 0:
      // Simple: Prefix + Suffix
      return randomElement(alienPrefixes) + randomElement(alienSuffixes);
    
    case 1:
      // Compound: Prefix + Middle + Suffix
      return (
        randomElement(alienPrefixes) +
        randomElement(alienMiddleParts) +
        randomElement(alienSuffixes)
      );
    
    case 2:
      // With descriptor: Prefix + Suffix + " " + Descriptor
      return (
        randomElement(alienPrefixes) +
        randomElement(alienSuffixes) +
        " " +
        randomElement(alienDescriptors)
      );
    
    case 3:
      // Complex: Prefix + Middle + Suffix + " " + Descriptor
      return (
        randomElement(alienPrefixes) +
        randomElement(alienMiddleParts) +
        randomElement(alienSuffixes) +
        " " +
        randomElement(alienDescriptors)
      );
    
    default:
      return randomElement(alienPrefixes) + randomElement(alienSuffixes);
  }
}
