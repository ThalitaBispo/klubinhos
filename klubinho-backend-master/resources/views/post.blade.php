
<form method="POST" action="{{ route('post.createPost') }}">
    @csrf
    <label for="title">Título:</label>
    <br>
    <label for="content">Conteúdo:</label>
    <textarea id="content" name="content"></textarea>
    <br>
    <label for="club_id">id do club</label>
    <input type="text" id="club_id" name="club_id">
    <button type="submit">Enviar</button>
</form>
