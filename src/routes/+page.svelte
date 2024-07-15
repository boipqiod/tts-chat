<script lang="ts">
  import {onMount} from "svelte";
  let voices: SpeechSynthesisVoice[] = [];
  let selectedVoice: SpeechSynthesisVoice | null = null;

  const speak = (text: string) => {
    if (text.trim() !== "") {
      const utterance = new SpeechSynthesisUtterance(text);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      window.speechSynthesis.speak(utterance);
    }
  };

  onMount(() => {
    const eventSource = new EventSource("/chat/sse");
    // Load available voices
    const loadVoices = () => {
      voices = window.speechSynthesis.getVoices();
      
      if (voices.length > 0 && !selectedVoice) {
        selectedVoice = voices[0];
      }
    };

    // Load voices initially and add event listener for when they change
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    console.log(eventSource);
    eventSource.addEventListener("message", (event) => {
      console.log(event.data);
      speak(event.data);
    });
    eventSource.addEventListener("error", (event) => {
      console.error(event);
    });
  });
</script>

<h1>Welcome to SvelteKit</h1>
<p>
  Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>
