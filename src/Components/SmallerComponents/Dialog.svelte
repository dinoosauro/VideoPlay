<script lang="ts">
    import { cubicInOut } from "svelte/easing";
    import { fade } from "svelte/transition";
    import AppendToBody from "../../ts/AppendToBody";
</script>
<div use:AppendToBody class="dialog"in:fade={{duration: 200, easing: cubicInOut}} out:fade={{duration: 200, easing: cubicInOut}}>
    <div>
        <div>
            <slot></slot>
        </div>
    </div>
</div>

<style>
    .dialog {
        width: 100vw;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 3;
        transition: opacity 0.2s ease-in-out;
        backdrop-filter: blur(16px) brightness(40%);
    }
    .dialog > div {
        width: 70vw;
        left: 15vw;
        height: 80vh;
        top: 10vh;
        border-radius: 12px;
        background-color: var(--card);
        position: fixed;
        overflow: auto;
    }
    .dialog > div > div {
        padding: 15px;
    }
</style>