<script lang="ts">
  import {onMount} from "svelte";
  import type {PageServerData} from "./$types";

  export let data: PageServerData;

  let voices: SpeechSynthesisVoice[] = [];
  let selectedVoice: SpeechSynthesisVoice | null = null;

  let messages: {name: string; message: string}[] = [...data.messages];

  onMount(() => {
    window.speechSynthesis.onvoiceschanged = loadVoices;

    const eventSource = new EventSource("/chat/sse");
    eventSource.addEventListener("message", receiveSseMassage);
  });

  const loadVoices = () => {
    voices = window.speechSynthesis
      .getVoices()
      .filter((voice) => voice.lang === "ko-KR");
    selectedVoice = voices[0];
  };

  const receiveSseMassage = (event: MessageEvent) => {
    const receivedMessage = JSON.parse(event.data);
    messages = [...messages, receivedMessage];
    speak(receivedMessage.message);
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;

    window.speechSynthesis.speak(utterance);
  };
</script>

<div class={"container"}>
  <select bind:value={selectedVoice}>
    {#each voices as voice}
      <option value={voice}>{voice.name}</option>
    {/each}
  </select>
  <textarea
    readonly
    rows={50}
    value={messages
      .map(({name, message}) => `[${name}]: ${message}`)
      .join("\n")}
  ></textarea>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
