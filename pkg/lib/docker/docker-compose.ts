import {execThrow} from '@violet/lib/exec';

interface DockerComposeNameToContainerNameOptions {
  cwd: string;
  cmd: string[];
}
export const dockerComposeNameToContainerName = async (dockerComposeName: string, {cwd = process.cwd(), cmd = ['docker-compose', 'ps']}: Partial<DockerComposeNameToContainerNameOptions> = {}): Promise<string> => {
  const {stdout} = await execThrow(cmd[0], [...cmd.slice(1), dockerComposeName], false, {cwd})
  return stdout.split(/[\n\r]+/)[2].replace(/^(\S+).*$/, '$1');
};
