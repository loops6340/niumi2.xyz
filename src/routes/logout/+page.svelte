<script>
	$effect(() => {
		(async () => {
			await fetch('/api/logout', {method: "POST"});
            console.log("YENDONOS")
			// redirect(307, '/');
		})();
	});
</script>

<div>Cerrando sesión................</div>
