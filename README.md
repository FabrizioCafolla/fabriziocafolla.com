# Fabrizio Cafolla Blog's

This is my personal blog: [fabriziocafolla.com](https://fabriziocafolla.com)

### Talks

You can find the slides from the talks in the [talk-slides](lib/website/public/talks/slides) folder or on the website.

## Devmode

### With Dev Container (Recommended)

1. Requirements: `Docker >=24`
2. Open the project in Visual Studio Code
3. Install the Dev Containers extension
4. Reopen in container when prompted
5. Website automatically starts at [http://localhost:4321](http://localhost:4321)

### Without Dev Container

1. **Requirements**

   | pkg    | version |
   | ------ | ------- |
   | Docker | `>=24`  |
   | Node   | `>=22`  |
   | Yarn   | `^1.22` |

2. **Setup the project:**

   ```bash
   just setup
   ```

3. **Start development server:**

   ```bash
   just dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:4321](http://localhost:4321)

---

<div align="center">License © All right reserved.</div>
