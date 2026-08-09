import { CAPSTONES } from "../src/data/capstones.ts";
import { writeFileSync, copyFileSync, mkdirSync } from "fs";
mkdirSync("capstone_validation/capstones", { recursive: true });
mkdirSync("capstone_validation/system-cards", { recursive: true });
for (const c of CAPSTONES) {
  writeFileSync(`capstone_validation/capstones/${c.capstoneId}.json`, JSON.stringify(c, null, 2));
}
// copy system cards
try { copyFileSync("src/data/system-cards/CP-N4-C.system-card.ts", "capstone_validation/system-cards/CP-N4-C.system-card.ts"); } catch {}
try { copyFileSync("src/data/system-cards/CP-FINAL.system-card.ts", "capstone_validation/system-cards/CP-FINAL.system-card.ts"); } catch {}
console.log("Mirrored", CAPSTONES.length, "capstone JSONs + system cards");
