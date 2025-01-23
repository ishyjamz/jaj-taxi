using jaj_taxi_back.Helper;
using jaj_taxi_back.Models.Entities;
using jaj_taxi_back.Services;
using Microsoft.AspNetCore.Mvc;

namespace jaj_taxi_back.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly GoogleAuthService _googleAuthService;
        private readonly JwtTokenGenerator _jwtTokenGenerator;

        public AuthController(GoogleAuthService googleAuthService, JwtTokenGenerator jwtTokenGenerator)
        {
            _googleAuthService = googleAuthService;
            _jwtTokenGenerator = jwtTokenGenerator;
        }

        [HttpPost("google")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
        {
            if (string.IsNullOrEmpty(request.Token))
            {
                return BadRequest(new { Message = "Token is required." });
            }

            try
            {
                var payload = await _googleAuthService.VerifyGoogleTokenAsync(request.Token);

                if (payload == null)
                {
                    return Unauthorized(new { Message = "Invalid Google token." });
                }

                // Example: Lookup user in your database or create a new one
                var userId = Guid.NewGuid().ToString(); // Replace with actual DB user lookup logic

                var jwtToken = _jwtTokenGenerator.GenerateToken(userId, payload.Email);

                return Ok(new { Token = jwtToken, Email = payload.Email, Name = payload.Name });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred during login.", Error = ex.Message });
            }
        }
    }
}