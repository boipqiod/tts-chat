<script lang="ts">
  import {onMount} from "svelte";
  import type {PageServerData} from "./$types";
  let voices: SpeechSynthesisVoice[] = [];
  let selectedVoice: SpeechSynthesisVoice | null = null;
  export let data: PageServerData;
  let messages: {name: string, message: string}[] = [...data.messages];

  const speak = (text: string) => {
    console.log('speaking', text);
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    console.log(selectedVoice, voices);
    
    window.speechSynthesis.speak(utterance);
  };

  onMount(() => {
    window.speechSynthesis.onvoiceschanged = loadVoices


    const eventSource = new EventSource("/chat/sse");
    eventSource.addEventListener("message", (event) => {
      const receivedMessage = JSON.parse(event.data);
      messages = [...messages, receivedMessage];
      speak(receivedMessage.message);
    });
    eventSource.addEventListener("error", (event) => {
      console.error(event);
    });
  });

  const loadVoices = () => {
      voices = window.speechSynthesis.getVoices().filter(voice => voice.lang === 'ko-KR');
      selectedVoice = voices[0];
    };
</script>

<div class={'container'}>
  <select bind:value={selectedVoice}>
    {#each voices as voice}
      <option value={voice}>{voice.name}</option>
    {/each}
  </select>
  <textarea readonly rows={50} value={
    messages.map(({name, message}) => `[${name}]: ${message}`).join('\n')
  } ></textarea>
</div>


<style>
  .container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>