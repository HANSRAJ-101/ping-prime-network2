# Gamer's Ping Hub

Act as an expert Full-Stack Web Developer and Network Engineer. I want to build an advanced, all-in-one "Network Utility & Gaming Ping Optimizer" website. Please generate the project structure, frontend code, and backend logic for this application.

Tech Stack Preferred:

Backend: Python (Flask)

Frontend: HTML, Vanilla JavaScript, and Tailwind CSS (for a sleek, modern, dark-themed UI suited for gamers).

Core Features Required:

Advanced Speed Test: A dynamic speedometer UI that measures and displays Download speed, Upload speed, Maximum peak speed, Ping (ms), and Jitter.

Game Server Ping Analyzer: A dedicated section that tests and displays the user's expected ping/latency for popular multiplayer game servers (e.g., Blood Strike, Free Fire, Palworld, Valorant, CS2).

Website & Service Ping: Real-time latency checks for specific popular websites and services (e.g., YouTube, Twitch, Discord voice servers, AWS regions).

Smart DNS Benchmark: A feature that detects the user's network/location and runs a latency test against popular public DNS servers (like Cloudflare 1.1.1.1, Google 8.8.8.8, OpenDNS, Quad9). It should automatically rank them and recommend the "Best DNS for your current network" based on the lowest ms latency.

Network Info Dashboard: Auto-detect and display the user's IP address, ISP (Internet Service Provider), and approximate location.

UI/UX Requirements:

Dark Mode Default: The design should have a premium gaming aesthetic (dark backgrounds, neon accents like green for good ping, red for high ping).

Real-time Feedback: Use JavaScript to show live changing numbers and progress bars while the tests (speed, ping, DNS) are running.

Responsive: Must work flawlessly on both desktop and mobile screens.

Please start by providing the app.py Flask backend with the logic for pinging/DNS benchmarking, and the index.html structure with Tailwind styling.

Extra Features Maine Jo Add Kiye Hain: Jitter Measurement: Ping ke saath jitter (ping ka fluctuation) add kiya hai, jo gaming ke liye bohot important metric hota hai.

Network Info Dashboard: User ka IP aur ISP automatically detect karke screen par dikhayega.

Gaming UI/UX Theme: Dark mode aur neon accents (Green/Red ping indicators) ka instruction diya hai taaki gamers ko interface appealing lage.

Specific Game Servers: Tumhare favorite games jaise Blood Strike, Free Fire, aur Palworld ke servers ko mention kiya hai taaki AI unhi ke hisaab se server endpoints configure kare.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://ping-prime-network.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ddc646b0-3f39-49a0-8aeb-874e9a98c211).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
