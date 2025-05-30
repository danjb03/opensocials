import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { handleCheckIntro } from "../shared/intro-utils.ts";

serve((req) => handleCheckIntro(req, "has_seen_creator_intro", true));
