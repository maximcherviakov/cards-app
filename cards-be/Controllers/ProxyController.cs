using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ProxyController : BaseApiController
{
    private readonly IHttpClientFactory _clientFactory;

    public ProxyController(IHttpClientFactory clientFactory)
    {
        _clientFactory = clientFactory;
    }

    [HttpGet("text-to-speech")]
    public async Task<ActionResult> GetSpeachFromText(string text, string lang)
    {
        var httpClient = _clientFactory.CreateClient();
        var request = new HttpRequestMessage(HttpMethod.Get, $"https://translate.google.com.vn/translate_tts?ie=UTF-8&q={text}&tl={lang}&client=tw-ob");

        var response = await httpClient.SendAsync(request);

        if (response.IsSuccessStatusCode)
        {
            var stream = await response.Content.ReadAsStreamAsync();
            return File(stream, "audio/mpeg");
        }
        else
        {
            return StatusCode((int)response.StatusCode);
        }
    }
}