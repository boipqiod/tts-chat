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

<svelte:head>
  <title>TTS 채팅방</title>
</svelte:head>

<div class={"container"}>
  <div style="display: flex; align-items: center; gap: 10px;">
    <img src="/logo.png" alt="Svelte logo" width="50" height="50" />
    <h1>TTS 채팅방</h1>
  </div>
  <details style={'width: 100%; margin: 20px 0;'}>
    <summary> 간단한 설명 </summary>
    <p>
      실시간 채팅을 받아서 TTS로 전달해주는 채팅방입니다. 접속해 계시면 계속해서 채팅이 들릴 수 있습니다.
      <br/>
      TTS가 들리지 않을 수 있으니, 꼭 테스트를 해보세요.
    </p>
  </details>

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
    rows={40}
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
