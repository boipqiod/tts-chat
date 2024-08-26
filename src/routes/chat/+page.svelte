<script lang="ts">
    import {getRandomId} from "../../utils/random";

  let message = ''
  let name = getRandomId()

  const sendMessage = () => {
    fetch('/chat/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, message })
    })
    message = ''
  }

</script>

<div>
  <div class="container">
    <input type="text" bind:value={name} />
    <input type="text" bind:value={message} />
    <button on:click={sendMessage}>Send</button>
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 80%;
    margin: 0 auto;
  }
  input {
    width: 100%;
  }
</style>