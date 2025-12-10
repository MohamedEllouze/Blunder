# Blunder Simulator – TypeScript Implementation

This project is a complete, fully-tested **TypeScript implementation of the Blunder robot simulator**. It includes an object-oriented architecture, comprehensive rule handling (breaker mode, inverter, teleporters, direction modifiers, priority system, loop detection), and a full test suite demonstrating correctness and robustness.

---

## 🚀 Tech Stack

- **TypeScript**
- **Node.js**
- **Jest** (unit testing)
- Clean OOP modeling: `Grid`, `Cell`, `Blunder`, enums, helpers

---

## 📁 Project Structure

BLUNDER/
│
├── tests/
│ ├── model/
│ │ ├── cell.model.test.ts
│ │ ├── grid.model.test.ts
│ ├── Blunder.test.ts
│ ├── testUtils.ts
│
├── enum/
│ ├── cell-type.enum.ts
│ ├── direction.enum.ts
│
├── model/
│ ├── cell.model.ts
│ ├── grid.model.ts
│
├── node_modules/
│
├── Blunder.ts
├── main.ts
├── jest.config.js
├── tsconfig.json
├── package.json
├── package-lock.json
└── README.md

## 🧠 Blunder Agent Rules

Blunder moves on a 2D grid and follows deterministic rules:

### **1. Direction Priority**
Default priority order:
SOUTH → EAST → NORTH → WEST

### **2. Obstacles**
- `#` — Wall (always blocks movement)
- `X` — Breakable wall (only passable in breaker mode)

### **3. Breaker Mode (B)**
- Toggled when stepping on `B`
- When active:  
  - Blunder destroys `X`  
  - `X` becomes `EMPTY`

### **4. Inverter (I)**
Reverses priority:
WEST → NORTH → EAST → SOUTH

### **5. Teleporters (T)**
- Teleport Blunder instantly to the matching teleporter

### **6. Direction Modifiers**
- `S` → force SOUTH  
- `N` → force NORTH  
- `E` → force EAST  
- `W` → force WEST  

### **7. Loop Detection**
Blunder tracks visited states:
(x, y, direction, breakerMode, priorityOrder)

Repeating a state → infinite loop detected.

---

## 📦 Installation

```bash
npm install

npm run build

npm test

npm run test:watch

---

Movement & priorities

Direction modifiers (S/E/N/W)

Breaker mode logic

Inverter behavior

Teleporters

Loop detection

Combined mechanics

Grid & Cell model validation

🔍 Example Grid
shell
Copier le code
##########
#   I    #
#        #
#   X    #
#   B  @ #
#     T  #
##########
Legend:

Symbol	Meaning
@	Start
$	Goal
#	Wall
X	Breakable wall
B	Breaker
I	Inverter
T	Teleporter
S/E/N/W	Forced direction

