let currentSubject = ''; 

document.getElementById('studyForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const subject = document.getElementById('subject').value.trim();
  const hours = document.getElementById('hours').value.trim();
  const goal = document.getElementById('goal').value.trim();
  const errorMsg = document.getElementById('errorMsg');
  const outputDiv = document.getElementById('output');
  const downloadBtn = document.getElementById('downloadBtn');

  if (!subject || !hours || !goal) {
    errorMsg.classList.remove('opacity-0', '-translate-y-2');
    errorMsg.classList.add('opacity-100', 'translate-y-0');
    return;
  } else {
    errorMsg.classList.add('opacity-0', '-translate-y-2');
    errorMsg.classList.remove('opacity-100', 'translate-y-0');
  }

  currentSubject = subject;

  outputDiv.innerHTML = `
    <p class="text-gray-400 italic animate-pulse flex items-center justify-center gap-1">
      ⏳ Generating<span class="dot-animation">.</span>
    </p>
  `;
  startDotAnimation();

  const prompt = `Create a study plan that follows the SMART framework and of course don't have to explain the SMART framework.I am a student who wants to ${goal} in the subject of ${subject}, studying ${hours} hours per day.Format it using markdown with bold section headings and bullet points.`;

  try {
    const response = await fetch('/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();
    const raw = data.content;

    const formatted = markdownToHtml(raw);

    stopDotAnimation();
    outputDiv.innerHTML = formatted;


  } catch (err) {
    stopDotAnimation();
    outputDiv.innerHTML = "<p class='text-red-500'>❌ Failed to generate plan. Please try again.</p>";
    console.error(err);
  }
});

function markdownToHtml(text) {
  return text
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-4">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6">$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/\n{2,}/g, '<br><br>') // Paragraph spacing
    .replace(/\n/g, '<br>') // Line breaks
    .replace(/<li>(.*?)<\/li>/gim, '<ul class="list-disc list-inside pl-4"><li>$1</li></ul>'); // wrap single li
}

let dotInterval = null;
function startDotAnimation() {
  const dotEl = document.querySelector(".dot-animation");
  let dots = 1;
  dotInterval = setInterval(() => {
    if (dotEl) {
      dots = (dots % 3) + 1;
      dotEl.textContent = '.'.repeat(dots);
    }
  }, 400);
}
function stopDotAnimation() {
  clearInterval(dotInterval);
  dotInterval = null;
}
