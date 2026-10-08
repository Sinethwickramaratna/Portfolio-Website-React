import clario from '../assets/Images/projects/clario.webp'
import amica from '../assets/Images/projects/amica.webp'
import orbit from '../assets/Images/projects/orbit.webp'
import cattle from '../assets/Images/projects/cattle-io.webp'
import academent from '../assets/Images/projects/academent.webp'

/** Project overview images, keyed by the project name used in content.js. */
const IMAGES = { Clario: clario, Amica: amica, ORBIT: orbit, 'Cattle.io': cattle, Academent: academent }

export const imageFor = (name) => IMAGES[name] || null
