<script lang="ts">
    const {secondCard}: {secondCard?: boolean} = $props();
</script>

<div class="card" style={secondCard ? "background-color: var(--secondcard)" : undefined}>
    <slot></slot>
</div>
