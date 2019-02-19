var GrayscalePipeline = new Phaser.Class({
    Extends: Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline,
    initialize:
        function GrayscalePipeline(game) {
            Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline.call(this, {
                game: game,
                renderer: game.renderer,
                fragShader: `
                    precision mediump float;
                    uniform sampler2D uMainSampler;
                    varying vec2 outTexCoord;
                    void main(void) {
                        vec4 color = texture2D(uMainSampler, outTexCoord);
                        float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
                        gl_FragColor = vec4(vec3(gray), 1.0);
                    }
                `
            });
        }
});

var DistortionPipeline = new Phaser.Class({
    Extends: Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline,
    initialize:
        function DistortionPipeline(game) {
            Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline.call(this, {
                game: game,
                renderer: game.renderer,
                fragShader: `
                    precision mediump float;    
                    uniform sampler2D sceneTex;
                    uniform float rt_w;
                    uniform float rt_h;
                    uniform float vx_offset;               
                    float offset[3];
                    float weight[3]; 
                    varying vec2 outTexCoord;
                    void main() { 
                        offset[0] = 0.0;
                        offset[1] =  1.3846153846;
                        offset[2] = 3.2307692308;
                        weight[0] = 0.2270270270;
                        weight[1] = 0.3162162162;
                        weight[2] = 0.0702702703;                        
                        vec3 tc = vec3(1.0, 0.0, 0.0);
                        if (outTexCoord.x<(vx_offset-0.01)) {
                            vec2 uv = outTexCoord.xy;
                            tc = texture2D(sceneTex, uv).rgb * weight[0];
                            for (int i=1; i<3; i++) {
                                tc += texture2D(sceneTex, uv + vec2(0.0, offset[i])/rt_h).rgb * weight[i];
                                tc += texture2D(sceneTex, uv - vec2(0.0, offset[i])/rt_h).rgb * weight[i];
                            }
                        }
                        else if (outTexCoord.x>=(vx_offset+0.01)) {
                            tc = texture2D(sceneTex, outTexCoord.xy).rgb;
                        }
                        gl_FragColor = vec4(tc, 1.0);
                    }
                `
            });
        }
});