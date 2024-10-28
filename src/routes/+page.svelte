<script lang="ts">
  import {onMount} from "svelte";
  import type {PageServerData} from "./$types";

  export let data: PageServerData;

  let voices: SpeechSynthesisVoice[] = [];
  let selectedVoice: SpeechSynthesisVoice | null = null;

  let messages: {name: string; message: string}[] = [...data.messages];

  let textareaRef: HTMLTextAreaElement;


  onMount(() => {
    setTimeout(loadVoices, 1000);
    const eventSource = new EventSource("/chat/sse");
    eventSource.addEventListener("message", receiveSseMassage);
    window.speechSynthesis.onvoiceschanged = loadVoices;
  });

  const loadVoices = () => {
    voices = window.speechSynthesis
      .getVoices()
      .filter((voice) => voice.lang === "ko-KR");
    if(voices.length > 0) selectedVoice = voices[0];
  };

  const receiveSseMassage = (event: MessageEvent) => {
    const receivedMessage = JSON.parse(event.data);
    messages = [...messages, receivedMessage];
    speak(receivedMessage.message);
    setTimeout(()=>{
      textareaRef.scrollTop = textareaRef.scrollHeight;
    }, 100);
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;

    window.speechSynthesis.speak(utterance);
  };
</script>

<div class={"container"}>
  <div style="display: flex;">
    <select bind:value={selectedVoice} style="width: 100%;">
      {#each voices as voice}
        <option value={voice}>{voice.name}</option>
      {/each}
    </select>
    <button style="width: 80px;" on:click={()=>{speak('테스트입니다.')}}>테스트</button>
  </div>

  <textarea
    bind:this={textareaRef}
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
    justify-content: center;
    margin: 0 auto;
    max-width: 800px;
    gap: 1rem;
  }
  textarea{
    font-size: 20px;
  }
</style>
